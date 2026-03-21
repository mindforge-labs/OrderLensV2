"use client";

import { useState } from "react";
import Image from "next/image";
import AppShell from "@/components/AppShell";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const PRODUCTS = [
  {
    id: "cold-brew",
    name: "Cold Brew Reserve",
    description: "Single Origin 350ml",
    price: 6.5,
    badge: "Premium",
    badgeStyle: "bg-tertiary-fixed text-on-tertiary-fixed",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCdqTKDP_7DeVcYsBAbwA_97uzYADjqM9SZL7BwlllNEKJ0p_f4g5vTfVWVKK-fvZLyo1eTDD5j9_k8faN6HIHo_WWkEXxO6TAvWVqauJuTx41uaCLy5jqY_NIARB_y8O55UWn5kSzDIX5-F0vJEeWNHQ_EKY6o_WEUOowbBQozhzff1nPAGLp_MUK68eoK6rtzxBkKwnLnSY-B1wx-kFB4RrOAakcuDdsIcTG3P2rydZkMxAVnF1oQxbNbuxUTlxquWAIrR0Ak9ko",
  },
  {
    id: "greek-yogurt",
    name: "Greek Yogurt",
    description: "Honey & Walnut 200g",
    price: 4.25,
    badge: "Organic",
    badgeStyle: "bg-secondary-container text-on-secondary-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB0RRFUm-ldXwOzsmkgzxnRAYspwzcbvMmsjkx2IHGBCnETp9OsIO0MiAcsdvGEujrnJRQxaXvfGXmGg3dDbHWrPglRuTdFSDI6_i1cKaGvU6EgMHbJAE2vuA1Ww58UYerCO-ZIcrlVw8x8W8TAwE98lhMewFL3urVQfr92784G3lKPQUYRT6m31T0TXXpC54pvLC31IwEO949-3mDwR9oVOTZZ8V2HXK-JIuHTI-jDOP7bFDnXhPrNr-WFOc6YsBtkx68Yw8iedYI",
  },
  {
    id: "sourdough",
    name: "Sourdough Baguette",
    description: "Fresh Baked Daily",
    price: 3.75,
    badge: null,
    badgeStyle: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOkWDtBFFAEUfHbxVPCvpPwK0NM-dHdwqtZDMsWZK0dfXuH3Dsmh_jApiWxDmXg9hLh_ZdPFGLeuRBAvc51MTRYvBevw4MKOs8qQiOFH-fB2TORYXuG976vqo3mzGV1Z78AK5G2istCLJisKqSj-MqY5ckUzEE5yw1GWJ48EBYHoHQfhPKi5FPfvaHfZ333dMyAGXTIlgOqev2T9d4R9KPMvdwZYdvAiIw7rMcPwTUXOTeotmD2aK4jyTk8gtIi7usHX4WynA1p4I",
  },
  {
    id: "chocolate",
    name: "Noir Chocolate",
    description: "85% Cocoa 100g",
    price: 5.95,
    badge: "Low Stock",
    badgeStyle: "bg-error-container text-on-error-container",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDuaG0k4IXnzKSMF4MUaZLF35NI4mhWEct8LptfmV1AW7Y2GtJ7QXSKtUCWgkS3KS4l7_Aj656abFoSvMpLnfEGULgMxct0u7Hjqa1JYU4QLKS-TgCVhzEMEvWmePa6Ak08-YnVrnb2vBX_pYCTBGNm3Ya3pYQj9VQeS0RVAUcESjD874B-nFX1pd5M2qcN6ICzHwmXW0-XJM7cVw_sOU4tX5s2Jxf7fQND85n0MHnDJ8BXbH9cqA2iOeWh2FEXxmSj8rqh0JIWexs",
  },
  {
    id: "water",
    name: "Mineral Water",
    description: "Sparkling 750ml",
    price: 2.99,
    badge: null,
    badgeStyle: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAkmcq9wJEH2Q5oxc2gphIKSUe3J2LPN47SMbYjRD0sWshGLxfEsnz41vfwZ4gj7gVoEgKXy7kBJq3b_eiPGFrdE_fcaMIir-aNruci24Opjn4ijJHyF_AWuS6-Kqa76geBBOfUQPJpUHyya_dgfHNMf96nioQ6DwQ-t26icYWG8xP67ZusiRzoiMMaKINPr3OKPNJR16kwrDcvinhNY2vxuxWgzlKja0MHbZmG6sCLVTbewRQzpq38aCVee__V4Kur0OFjN0DzRZE",
  },
  {
    id: "turkey",
    name: "Smoked Turkey",
    description: "Deli Sliced 150g",
    price: 7.2,
    badge: null,
    badgeStyle: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8JPbW_fHIehDWEaBogESC8DA889gl0eSnp8rh-wW-Ro0AWsXxgap94m5j2Gk8fhV0O1iMhGIZ-x3AABXwubMVkeMOAR1Tly5BfyqJ_Rx_g3bLy0RoxJBUuWxCsuYRupUMwUzVj9MeqLH0lQNSXFul4-b4N5FFg6Ob1o9IHKJ0-F1OKTC5bXMnEjwwaaEPXvKFAVf_cSJI0M5TOiiWlUayVBVyXkxFDSFbOxL9fEIYnn68b_l3zkk3qZaekVp1Epy07wNpH89shsQ",
  },
];

const CATEGORIES = ["All Items", "Beverages", "Snacks", "Deli", "Bakery", "Dairy"];

export default function PosTerminalPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [orderId] = useState(`TX-${Math.floor(1000 + Math.random() * 9000)}`);

  const addToCart = (product: (typeof PRODUCTS)[0]) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        { id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 },
      ];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <AppShell className="overflow-hidden">
      <div className="flex h-full overflow-hidden">
        {/* Product Grid */}
        <section className="flex-1 overflow-y-auto bg-surface p-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-2">
                  Terminal Interface
                </h1>
                <p className="text-on-surface-variant text-sm">
                  Scan items or select manually from the curated catalog.
                </p>
              </div>
              <div className="relative w-full md:w-80">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">
                  search
                </span>
                <input
                  className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-b-2 border-transparent focus:border-primary focus:ring-0 text-sm transition-all outline-none"
                  placeholder="Search curated products..."
                  type="text"
                />
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={
                    activeCategory === cat
                      ? "px-6 py-2 rounded-full bg-primary text-on-primary text-xs font-semibold uppercase tracking-wider whitespace-nowrap"
                      : "px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-xs font-semibold uppercase tracking-wider hover:bg-surface-container-highest transition-colors whitespace-nowrap"
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {PRODUCTS.map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="group bg-surface-container-lowest rounded-full p-6 transition-all duration-300 hover:bg-white hover:shadow-xl hover:shadow-primary/5 cursor-pointer relative overflow-hidden"
                >
                  {product.badge && (
                    <div className="absolute top-4 right-6">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${product.badgeStyle}`}
                      >
                        {product.badge}
                      </span>
                    </div>
                  )}
                  <div className="aspect-square w-full mb-6 rounded-full overflow-hidden bg-surface-container-low">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      unoptimized
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-semibold text-on-surface mb-1">{product.name}</h3>
                    <p className="text-xs text-on-surface-variant mb-3">{product.description}</p>
                    <span className="text-lg font-bold text-primary tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right Sidebar: Order Summary */}
        <aside className="w-96 bg-surface-container-low flex flex-col border-l border-outline-variant/10 flex-shrink-0">
          <div className="p-6 border-b border-outline-variant/10">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-bold tracking-tight">Active Order</h2>
              <span className="text-[10px] font-bold text-on-surface-variant bg-surface-container-highest px-2 py-1 rounded">
                #{orderId}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant">Customer: Walk-in Guest</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant">
                <span className="material-symbols-outlined text-4xl mb-2 block text-outline-variant">
                  shopping_cart
                </span>
                <p className="text-sm">Click products to add them to the order</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-lowest overflow-hidden border border-outline-variant/10">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                        unoptimized
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">{item.name}</h4>
                      <p className="text-[10px] text-on-surface-variant tabular-nums">
                        ${item.price.toFixed(2)} / unit
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-surface-container-lowest rounded-full px-2 py-1 shadow-sm border border-outline-variant/5">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">remove</span>
                    </button>
                    <span className="text-xs font-bold tabular-nums w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">add</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* AI Confidence Gauge */}
          <div className="mx-6 mb-4 bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                AI Confidence
              </span>
              <span className="text-sm font-bold text-primary tabular-nums">98.4%</span>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: "98.4%" }}
              ></div>
            </div>
          </div>

          <div className="p-6 border-t border-outline-variant/10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Subtotal
              </span>
              <span className="text-xl font-bold tabular-nums text-on-surface">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <button
              className="w-full velocity-gradient text-on-primary py-4 rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all"
              disabled={cart.length === 0}
            >
              Finalize Order
            </button>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
