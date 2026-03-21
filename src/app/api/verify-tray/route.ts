import { NextRequest, NextResponse } from "next/server";

// ---- Types ----
type MenuItem = {
  productId: string;
  displayName: string;
  shortLabel: string;
  category: string;
  visualTags: string[];
};

type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
};

type Order = {
  orderId: string;
  items: OrderItem[];
};

type DetectedItem = {
  productId: string;
  productName: string;
  quantity: number;
};

type VerificationResponse = {
  success: boolean;
  detectedItems: DetectedItem[];
  notes: string[];
};

function buildVisionPrompt(order: Order, menuCatalog: MenuItem[]): string {
  const itemDescriptions = menuCatalog
    .map(
      (item) =>
        `- ${item.productId} (${item.displayName}): ${item.visualTags.join(", ")}`
    )
    .join("\n");

  const expectedItems = order.items
    .map((item) => `  - ${item.name} x${item.quantity}`)
    .join("\n");

  return `You are an AI tray verification system for a retail point-of-sale. 
Analyze the image of a food/retail tray and identify all items present.

KNOWN PRODUCT CATALOG (use these exact productId values):
${itemDescriptions}

EXPECTED ORDER (for context only — detect ALL items you actually see, not just expected ones):
${expectedItems}

Instructions:
1. Carefully examine every item visible in the tray image
2. For each recognized item, record its productId, productName, and count
3. Only use productId values from the catalog above
4. If you see items not in the catalog, skip them but add a note
5. Be precise with quantities — count each visible unit

Respond ONLY with valid JSON in this exact format (no markdown, no explanation):
{
  "detectedItems": [
    {"productId": "string", "productName": "string", "quantity": number}
  ],
  "notes": ["optional notes about confidence, unclear items, etc."]
}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expectedOrder, menuCatalog, imageBase64 } = body as {
      expectedOrder: Order;
      menuCatalog: MenuItem[];
      imageBase64: string;
    };

    if (!expectedOrder || !menuCatalog || !imageBase64) {
      return NextResponse.json(
        { error: "Missing required fields: expectedOrder, menuCatalog, imageBase64" },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Prepare image content
    let imageContent: object;
    if (imageBase64.startsWith("data:")) {
      const [header, data] = imageBase64.split(",");
      const mediaType = header.split(":")[1]?.split(";")[0] ?? "image/jpeg";
      imageContent = {
        type: "image",
        source: {
          type: "base64",
          media_type: mediaType,
          data: data,
        },
      };
    } else {
      // URL-based image
      imageContent = {
        type: "image",
        source: {
          type: "url",
          url: imageBase64,
        },
      };
    }

    const prompt = buildVisionPrompt(expectedOrder, menuCatalog);

    const anthropicResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-4-5",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              imageContent,
              {
                type: "text",
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!anthropicResponse.ok) {
      const errText = await anthropicResponse.text();
      console.error("Anthropic API error:", errText);
      return NextResponse.json(
        { error: `Anthropic API error: ${anthropicResponse.status}` },
        { status: 502 }
      );
    }

    const anthropicData = await anthropicResponse.json();
    const rawText =
      anthropicData.content?.[0]?.text ?? "";

    // Parse JSON from response
    let parsed: VerificationResponse;
    try {
      // Strip any markdown fences just in case
      const clean = rawText
        .replace(/```json\s*/gi, "")
        .replace(/```\s*/gi, "")
        .trim();
      parsed = JSON.parse(clean);
    } catch {
      console.error("Failed to parse Claude response:", rawText);
      return NextResponse.json({
        success: false,
        detectedItems: [],
        notes: ["Failed to parse AI response. Raw: " + rawText.slice(0, 200)],
      });
    }

    return NextResponse.json({
      success: true,
      detectedItems: parsed.detectedItems ?? [],
      notes: parsed.notes ?? [],
    });
  } catch (error) {
    console.error("verify-tray route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
