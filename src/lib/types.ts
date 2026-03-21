export type MenuItem = {
  productId: string;
  displayName: string;
  shortLabel: string;
  category: string;
  visualTags: string[];
  thumbnail?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  quantity: number;
};

export type Order = {
  orderId: string;
  items: OrderItem[];
};

export type DetectedItem = {
  productId: string;
  productName: string;
  quantity: number;
};

export type MissingItem = {
  productId: string;
  productName: string;
  expectedQuantity: number;
  detectedQuantity: number;
  missingQuantity: number;
};

export type ExtraItem = {
  productId: string;
  productName: string;
  detectedQuantity: number;
};

export type QuantityMismatch = {
  productId: string;
  productName: string;
  expectedQuantity: number;
  detectedQuantity: number;
};

export type VerificationStatus = "matched" | "mismatch";

export type VerificationResult = {
  success: boolean;
  verificationStatus: VerificationStatus;
  summary: string;
  detectedItems: DetectedItem[];
  missingItems: MissingItem[];
  extraItems: ExtraItem[];
  quantityMismatches: QuantityMismatch[];
  notes: string[];
};

export const MENU_CATALOG: MenuItem[] = [
  {
    productId: "snack_red",
    displayName: "Snack Red",
    shortLabel: "Red Snack Pack",
    category: "snack_pack",
    visualTags: ["red package", "small snack bag", "bright red wrapper"],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuByBBINjQ-3fkuSUg-7_i4A1SWuqfyTmKu8EpazZ4xDqo1CcOjolvvubASfF0zAQPn6atvl0h5qA89yyF7iP0b3gsorDUxh-A5-L_TARzl6uKv_g40WCKfRM47kY93Ib8aHrYRyXg51PcRpxuKBMwCbFEqOne_V6jhRVe9e8026ix3oJjR4m7gZXbwIqshZsVq57ekhANiNMxH8WEFFVcS4WsOqVUfyLkvx2etBiZCA8qwOHriWZ-iSu5pYS5vhaJ205DbKV1a_FqE",
  },
  {
    productId: "snack_blue",
    displayName: "Snack Blue",
    shortLabel: "Blue Snack Pack",
    category: "snack_pack",
    visualTags: ["blue package", "small snack bag", "bright blue wrapper"],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDxt9AOCHtWh8Ey7LP8K9sg3TtqNU7B1SgWiVLCqb8yR9MvipZA0X3Imn8UgFqYCqvf47dT_z20w1EEyXvseC2oNVVGIsYg1CYXP4ZxkUWQJfuA7FLfhD7giZwFue49zZBSutooptmh0LylEwpj3U3Wq7Oyr0RyTojUTSWaiCA1_LqJwVK5AFBeSyxKIue6DnUMM2LEvX6VVnw2g-CYl43MUJyRKNhIjSydGrCyMSJRdS8BNcXp7FgZ9oCC_khEMT4jEl_ZnY9S8Zw",
  },
  {
    productId: "cola_can",
    displayName: "Cola Can",
    shortLabel: "Cola Can",
    category: "drink_can",
    visualTags: ["soft drink can", "aluminum can", "red soda can"],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCS4fXtn6PgDuTajxFHHNJTGK7DhfrGaDJTUvZyllWJsHAhQ6XfEseJDx3DXpddz70JMpcTsom7TwxY2mlmxKcMPLoICOavyFBjJeNH3wPI74RJbXp8MKQMA2KuiD4xiPF_u-96DFvOtLSrQ_1nGVcuPDLtXI_ouGILo-7Lfg7TPv_0J-dLzHdCxt9Xur4cnlLfmGzgc4Df3TKg57PHWKdSHLfmE3bB_Mn8S9y_sgKKjMbBLsfSTC-JrdmgTSWPkRDE69CLZFmog9U",
  },
  {
    productId: "water_bottle",
    displayName: "Water Bottle",
    shortLabel: "Water Bottle",
    category: "drink_bottle",
    visualTags: ["clear plastic bottle", "water bottle", "transparent bottle"],
    thumbnail:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB8YKh2yY-TbKeOp6RL5rMQc648vf7lYsqO3P_-Sxv8T2nJHuQY-QkcZ3s4BUmvIxRCRhj4KwQY82Efqh1MhJEuL_mVmzlSXDfPPXYYFF-VLkaK7t1rHQPTRK31ljQCZU5MlqslAOwRFyYXYYR1UCJra-so-ByWvaDW92IsCTGHzSmRqwfgwtWV-VbRV5UpOBinejjmujggg1pdKuPj2hfVbJPxd8sj3Fo3q8vEiCnjlwzZm-JRRtTzerOqSTaA6eerfw4Ji1UaGWA",
  },
];

export const DEMO_ORDERS = [
  {
    id: "demo-a",
    label: "Demo A — Matched",
    order: {
      orderId: "ORD-DEMO-A",
      items: [
        { productId: "snack_red", name: "Snack Red", quantity: 2 },
        { productId: "cola_can", name: "Cola Can", quantity: 1 },
      ],
    },
  },
  {
    id: "demo-b",
    label: "Demo B — Missing item",
    order: {
      orderId: "ORD-DEMO-B",
      items: [
        { productId: "snack_red", name: "Snack Red", quantity: 2 },
        { productId: "cola_can", name: "Cola Can", quantity: 1 },
      ],
    },
  },
  {
    id: "demo-c",
    label: "Demo C — Extra item",
    order: {
      orderId: "ORD-DEMO-C",
      items: [
        { productId: "snack_red", name: "Snack Red", quantity: 2 },
        { productId: "cola_can", name: "Cola Can", quantity: 1 },
      ],
    },
  },
];

export function compareOrder(
  expectedOrder: Order,
  detectedItems: DetectedItem[]
): VerificationResult {
  const expectedMap = new Map<string, { name: string; quantity: number }>();
  for (const item of expectedOrder.items) {
    expectedMap.set(item.productId, { name: item.name, quantity: item.quantity });
  }

  const detectedMap = new Map<string, DetectedItem>();
  for (const d of detectedItems) {
    detectedMap.set(d.productId, d);
  }

  const missingItems: MissingItem[] = [];
  const extraItems: ExtraItem[] = [];
  const quantityMismatches: QuantityMismatch[] = [];

  for (const [productId, expected] of Array.from(expectedMap.entries())) {
    const detected = detectedMap.get(productId);
    if (!detected) {
      missingItems.push({
        productId,
        productName: expected.name,
        expectedQuantity: expected.quantity,
        detectedQuantity: 0,
        missingQuantity: expected.quantity,
      });
    } else if (detected.quantity !== expected.quantity) {
      const missingQuantity = Math.max(0, expected.quantity - detected.quantity);
      if (missingQuantity > 0) {
        missingItems.push({
          productId,
          productName: expected.name,
          expectedQuantity: expected.quantity,
          detectedQuantity: detected.quantity,
          missingQuantity,
        });
      }
      quantityMismatches.push({
        productId,
        productName: expected.name,
        expectedQuantity: expected.quantity,
        detectedQuantity: detected.quantity,
      });
    }
  }

  for (const [productId, detected] of Array.from(detectedMap.entries())) {
    if (!expectedMap.has(productId)) {
      extraItems.push({
        productId,
        productName: detected.productName,
        detectedQuantity: detected.quantity,
      });
    }
  }

  const hasMismatch =
    missingItems.length > 0 || extraItems.length > 0 || quantityMismatches.length > 0;

  return {
    success: true,
    verificationStatus: hasMismatch ? "mismatch" : "matched",
    summary: hasMismatch
      ? "Tray does not match the expected order."
      : "Tray matches the expected order.",
    detectedItems,
    missingItems,
    extraItems,
    quantityMismatches,
    notes: [],
  };
}
