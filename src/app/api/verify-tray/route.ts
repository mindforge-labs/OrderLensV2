import { NextRequest, NextResponse } from "next/server";

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

type MissingItem = {
  productId: string;
  productName: string;
  expectedQuantity: number;
  detectedQuantity: number;
  missingQuantity: number;
};

type ExtraItem = {
  productId: string;
  productName: string;
  detectedQuantity: number;
};

type QuantityMismatch = {
  productId: string;
  productName: string;
  expectedQuantity: number;
  detectedQuantity: number;
};

type VerificationStatus = "matched" | "mismatch";

type VerificationResult = {
  success: boolean;
  verificationStatus: VerificationStatus;
  summary: string;
  detectedItems: DetectedItem[];
  missingItems: MissingItem[];
  extraItems: ExtraItem[];
  quantityMismatches: QuantityMismatch[];
  notes: string[];
};

const FALLBACK_RESPONSE: VerificationResult = {
  success: false,
  verificationStatus: "mismatch",
  summary: "Unable to verify tray reliably.",
  detectedItems: [],
  missingItems: [],
  extraItems: [],
  quantityMismatches: [],
  notes: ["Model response could not be parsed safely."],
};

function buildSystemInstruction(): string {
  return [
    "You are an AI vision verification assistant for a fast-food POS system.",
    "",
    "Your task is to analyze a tray image and compare the visible items against the expected POS order.",
    "",
    "Important rules:",
    "1. Only identify items from the provided allowed menu list.",
    "2. Do not invent new products outside the allowed menu.",
    "3. Count visible items conservatively and carefully.",
    "4. If an item is uncertain, prefer the closest allowed product based on visual tags, but do not hallucinate.",
    "5. Your job is not only to detect items, but also to compare them with the expected order.",
    "6. Return valid JSON only.",
    "7. Do not include markdown fences.",
    "8. Do not include explanations outside the JSON.",
  ].join("\n");
}

function buildUserPrompt(menuCatalog: MenuItem[], expectedOrder: Order): string {
  const menuJson = JSON.stringify(menuCatalog, null, 2);
  const orderJson = JSON.stringify(expectedOrder, null, 2);

  return [
    "Allowed menu list:",
    menuJson,
    "",
    "Expected POS order:",
    orderJson,
    "",
    "Task:",
    "Analyze the tray image and detect the visible items using only the allowed menu list.",
    "Then compare the detected items with the expected POS order.",
    "",
    "Return JSON with this exact structure:",
    "{",
    '  "success": true,',
    '  "verificationStatus": "matched" | "mismatch",',
    '  "summary": "string",',
    '  "detectedItems": [',
    "    {",
    '      "productId": "string",',
    '      "productName": "string",',
    '      "quantity": number',
    "    }",
    "  ],",
    '  "missingItems": [',
    "    {",
    '      "productId": "string",',
    '      "productName": "string",',
    '      "expectedQuantity": number,',
    '      "detectedQuantity": number,',
    '      "missingQuantity": number',
    "    }",
    "  ],",
    '  "extraItems": [',
    "    {",
    '      "productId": "string",',
    '      "productName": "string",',
    '      "detectedQuantity": number',
    "    }",
    "  ],",
    '  "quantityMismatches": [',
    "    {",
    '      "productId": "string",',
    '      "productName": "string",',
    '      "expectedQuantity": number,',
    '      "detectedQuantity": number',
    "    }",
    "  ],",
    '  "notes": ["string"]',
    "}",
    "",
    "Decision rules:",
    '- If all products and quantities match the expected order exactly, set verificationStatus to "matched".',
    '- Otherwise set verificationStatus to "mismatch".',
    "- An item in detectedItems must belong to the allowed menu list.",
    "- missingItems should contain items where detected quantity is lower than expected.",
    "- extraItems should contain detected items not expected in the order.",
    "- quantityMismatches should contain items whose detected quantity differs from expected quantity.",
    "- Keep notes short and practical.",
    "",
    "The tray contains only a small number of items. Focus on precise counting.",
  ].join("\n");
}

function toInlineImagePart(imageBase64: string) {
  if (imageBase64.startsWith("data:")) {
    const [header, data] = imageBase64.split(",", 2);
    const mimeType = header.split(":")[1]?.split(";")[0] ?? "image/jpeg";
    return {
      inline_data: {
        mime_type: mimeType,
        data,
      },
    };
  }

  return {
    inline_data: {
      mime_type: "image/jpeg",
      data: imageBase64,
    },
  };
}

async function callGemini(
  imageBase64: string,
  menuCatalog: MenuItem[],
  expectedOrder: Order
): Promise<VerificationResult> {
  console.log('🔍 DEBUG ENV VARS:');
  console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'present' : 'MISSING');
  console.log('NEXT_PUBLIC_COGNITO_USER_POOL_ID:', process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ? 'present' : 'MISSING');
  console.log('NEXT_PUBLIC_COGNITO_CLIENT_ID:', process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ? 'present' : 'MISSING');
  console.log('NEXT_PUBLIC_COGNITO_REGION:', process.env.NEXT_PUBLIC_COGNITO_REGION ? 'present' : 'MISSING');
  console.log('All env keys containing GEMINI or COGNITO:', Object.keys(process.env).filter(k => k.includes('GEMINI') || k.includes('COGNITO')));

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const detectedItems: DetectedItem[] = expectedOrder.items.map((item) => ({
      productId: item.productId,
      productName: item.name,
      quantity: item.quantity,
    }));

    return {
      success: true,
      verificationStatus: "matched",
      summary: "Mocked response: tray assumed to match expected order.",
      detectedItems,
      missingItems: [],
      extraItems: [],
      quantityMismatches: [],
      notes: ["Gemini not configured; using local mock."],
    };
  }

  const systemInstruction = buildSystemInstruction();
  const userPrompt = buildUserPrompt(menuCatalog, expectedOrder);

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent" +
        `?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }, toInlineImagePart(imageBase64)],
            },
          ],
          generationConfig: {
            response_mime_type: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("Gemini HTTP error", response.status, await response.text());
      return FALLBACK_RESPONSE;
    }

    const raw = await response.json();
    const text: string | undefined =
      raw?.candidates?.[0]?.content?.parts?.[0]?.text ??
      raw?.candidates?.[0]?.content?.parts?.[0]?.json;

    if (!text || typeof text !== "string") {
      console.error("Gemini response missing text", raw);
      return FALLBACK_RESPONSE;
    }

    const cleaned = text.trim().replace(/^```json\s*|```$/g, "");

    let parsed: VerificationResult | null = null;
    try {
      parsed = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse Gemini JSON", error, cleaned);
      return FALLBACK_RESPONSE;
    }

    if (!parsed || !Array.isArray(parsed.detectedItems)) {
      console.error("Parsed Gemini result invalid", parsed);
      return FALLBACK_RESPONSE;
    }

    return parsed;
  } catch (error) {
    console.error("Gemini call exception", error);
    return FALLBACK_RESPONSE;
  }
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

    const result = await callGemini(imageBase64, menuCatalog, expectedOrder);
    return NextResponse.json(result);
  } catch (error) {
    console.error("verify-tray route error:", error);
    return NextResponse.json(FALLBACK_RESPONSE, { status: 500 });
  }
}
