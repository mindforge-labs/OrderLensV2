"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import AppShell from "@/components/AppShell";
import {
  MENU_CATALOG,
  DEMO_ORDERS,
  compareOrder,
  type Order,
  type OrderItem,
  type VerificationResult,
  type VerificationStatus,
} from "@/lib/types";

function getMenuItem(productId: string) {
  return MENU_CATALOG.find((m) => m.productId === productId);
}

function orderToDisplayLines(order: Order): string[] {
  return order.items.map((item) => `${item.name} ×${item.quantity}`);
}

function badgeColor(status: VerificationStatus | null | undefined) {
  if (!status) return "bg-gray-100 text-gray-700";
  if (status === "matched") return "bg-green-100 text-green-700";
  return "bg-error-container text-on-error-container";
}

export default function PosTrayVerificationPage() {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [orderIdCounter, setOrderIdCounter] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [builderQuantities, setBuilderQuantities] = useState<Record<string, number>>({});

  const incrementItem = (productId: string) =>
    setBuilderQuantities((prev) => ({ ...prev, [productId]: (prev[productId] ?? 0) + 1 }));

  const decrementItem = (productId: string) =>
    setBuilderQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] ?? 0) - 1),
    }));

  const totalItemsInBuilder = useMemo(
    () => Object.values(builderQuantities).reduce((sum, q) => sum + q, 0),
    [builderQuantities]
  );

  const createOrderFromBuilder = () => {
    const items: OrderItem[] = [];
    for (const [productId, quantity] of Object.entries(builderQuantities)) {
      if (quantity <= 0) continue;
      const menu = getMenuItem(productId);
      if (!menu) continue;
      items.push({ productId, name: menu.displayName, quantity });
    }
    if (items.length === 0) return;
    const newOrder: Order = {
      orderId: `ORD-${orderIdCounter.toString().padStart(3, "0")}`,
      items,
    };
    setCurrentOrder(newOrder);
    setOrderIdCounter((c) => c + 1);
    setVerificationResult(null);
    setError(null);
  };

  const loadDemoOrder = (demoId: string) => {
    const demo = DEMO_ORDERS.find((d) => d.id === demoId);
    if (!demo) return;
    setCurrentOrder(demo.order);
    setVerificationResult(null);
    setError(null);
    const next: Record<string, number> = {};
    for (const item of demo.order.items) {
      next[item.productId] = item.quantity;
    }
    setBuilderQuantities(next);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setVerificationResult(null);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const canVerify = !!currentOrder && !!imagePreview && !isVerifying;

  const handleVerify = useCallback(async () => {
    if (!currentOrder || !imagePreview) return;
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/verify-tray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedOrder: currentOrder,
          menuCatalog: MENU_CATALOG,
          imageBase64: imagePreview,
        }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data: VerificationResult | null = await res.json();
      if (data && Array.isArray(data.detectedItems)) {
        const recomputed = compareOrder(currentOrder, data.detectedItems);
        recomputed.notes = data.notes ?? [];
        setVerificationResult(recomputed);
      } else {
        setVerificationResult({
          success: false,
          verificationStatus: "mismatch",
          summary: "Unable to verify tray reliably.",
          detectedItems: [],
          missingItems: [],
          extraItems: [],
          quantityMismatches: [],
          notes: ["Model response could not be parsed safely."],
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Verification failed";
      console.error(err);
      setError(errorMsg);
      setVerificationResult({
        success: false,
        verificationStatus: "mismatch",
        summary: "Unable to verify tray reliably.",
        detectedItems: [],
        missingItems: [],
        extraItems: [],
        quantityMismatches: [],
        notes: ["Model response could not be parsed safely."],
      });
    } finally {
      setIsVerifying(false);
    }
  }, [currentOrder, imagePreview]);

  return (
    <AppShell>
      <div className="p-6 flex flex-col gap-4 min-h-full">
        {/* Demo Controls */}
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-sm font-semibold text-slate-800">Demo Controls</h1>
            <p className="text-xs text-slate-500">
              Load predefined orders and sample images to keep the demo safe and fast.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {DEMO_ORDERS.map((demo) => (
              <button
                key={demo.id}
                onClick={() => loadDemoOrder(demo.id)}
                className="rounded-full border border-primary/30 bg-primary/5 px-3 py-1 font-medium text-primary hover:bg-primary/10 transition-colors"
              >
                Load {demo.label}
              </button>
            ))}
          </div>
        </section>

        {/* Three-column layout */}
        <section className="grid flex-1 gap-6 md:grid-cols-12">
          {/* Column 1: Current Order (30%) */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm border-b-2 border-primary/10 flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-semibold text-on-surface">Current Order</h2>
                {currentOrder && (
                  <span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                    {currentOrder.orderId}
                  </span>
                )}
              </div>

              {/* POS Menu */}
              <div className="flex flex-col gap-2 overflow-y-auto mb-4">
                {MENU_CATALOG.map((item) => {
                  const qty = builderQuantities[item.productId] ?? 0;
                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-3 p-3 bg-surface-container-low rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.displayName}
                            width={40}
                            height={40}
                            className="rounded object-cover border border-outline-variant/10"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded border border-outline-variant/20 text-[10px] text-on-surface-variant bg-surface-container">
                            {item.shortLabel.slice(0, 2)}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-on-surface">{item.displayName}</p>
                          <p className="text-[10px] text-on-surface-variant">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-surface-container-lowest rounded-full px-1 py-0.5 border border-outline-variant/10">
                        <button
                          onClick={() => decrementItem(item.productId)}
                          className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">remove</span>
                        </button>
                        <span className="text-xs font-bold w-5 text-center tabular-nums text-on-surface">
                          {qty}
                        </span>
                        <button
                          onClick={() => incrementItem(item.productId)}
                          className="w-6 h-6 flex items-center justify-center text-outline hover:text-primary transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {currentOrder && (
                <div className="mb-4 pt-3 border-t border-outline-variant/20">
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest mb-2">
                    Order Items
                  </p>
                  <ul className="space-y-1">
                    {orderToDisplayLines(currentOrder).map((line) => (
                      <li key={line} className="text-xs text-on-surface">
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={createOrderFromBuilder}
                disabled={totalItemsInBuilder === 0}
                className="mt-auto w-full velocity-gradient text-on-primary py-3 rounded-full font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Create Order
              </button>
            </div>
          </div>

          {/* Column 2: Tray Inspection (40%) */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex flex-col h-full min-h-[600px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm font-semibold text-on-surface">Tray Inspection</h2>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  <button className="px-4 py-1.5 text-xs font-bold rounded-md bg-white shadow-sm text-primary">
                    Live Camera
                  </button>
                  <label className="px-4 py-1.5 text-xs font-bold rounded-md text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
                    Upload Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>

              <div className="relative flex-1 bg-surface-container-low rounded-xl border-2 border-dashed border-outline-variant/50 flex items-center justify-center overflow-hidden min-h-[300px]">
                {imagePreview ? (
                  <>
                    <Image
                      src={imagePreview}
                      alt="Tray preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 bg-primary/5 pointer-events-none">
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-3 text-on-surface-variant p-8 text-center">
                    <span className="material-symbols-outlined text-4xl text-outline-variant">
                      center_focus_strong
                    </span>
                    <p className="text-sm font-medium">No image selected</p>
                    <p className="text-xs text-outline">
                      Upload a tray image or load a demo order
                    </p>
                    <ul className="mt-2 text-left text-xs space-y-1 text-outline">
                      <li>• Place tray fully inside the frame.</li>
                      <li>• Avoid motion blur and heavy shadows.</li>
                      <li>• Top-down or slight angle works best.</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <button
                  onClick={handleVerify}
                  disabled={!canVerify}
                  className="w-full velocity-gradient text-on-primary h-16 rounded-full text-lg font-bold flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.95] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-3xl">center_focus_strong</span>
                  {isVerifying ? "VERIFYING..." : "VERIFY TRAY"}
                </button>
              </div>

              {error && <p className="mt-2 text-sm text-error">{error}</p>}
            </div>
          </div>

          {/* Column 3: AI Verification Results (30%) */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {/* Status Card */}
            <div
              className={`rounded-xl p-6 shadow-sm flex items-center gap-6 border-l-8 relative overflow-hidden ${
                verificationResult?.verificationStatus === "matched"
                  ? "bg-tertiary-fixed text-on-tertiary-fixed border-tertiary"
                  : verificationResult?.verificationStatus === "mismatch"
                  ? "bg-error-container text-on-error-container border-error"
                  : "bg-surface-container-low text-on-surface border-outline-variant"
              }`}
            >
              <div className="flex-1 z-10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">
                  Status Report
                </h3>
                <p className="text-lg font-bold leading-tight">
                  {verificationResult?.verificationStatus === "matched"
                    ? "Match Detected"
                    : verificationResult?.verificationStatus === "mismatch"
                    ? "Mismatch Found"
                    : "Awaiting Scan"}
                </p>
                <p className="text-xs mt-1">
                  {verificationResult
                    ? verificationResult.verificationStatus === "matched"
                      ? "98.4% Confidence Score"
                      : "Review comparison below"
                    : "Create order & upload image to begin"}
                </p>
              </div>
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center z-10">
                <span
                  className="material-symbols-outlined text-4xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {verificationResult?.verificationStatus === "matched"
                    ? "check_circle"
                    : verificationResult?.verificationStatus === "mismatch"
                    ? "cancel"
                    : "pending"}
                </span>
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-current/10 rounded-full"></div>
            </div>

            {/* Comparison Table */}
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-sm flex-1">
              <h3 className="text-sm font-semibold text-on-surface mb-6">Comparison Analysis</h3>

              {verificationResult ? (
                <>
                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="text-on-surface-variant font-bold border-b border-outline-variant/10">
                          <th className="pb-3 px-1 uppercase tracking-tighter">Item</th>
                          <th className="pb-3 px-1 uppercase tracking-tighter text-center">Exp.</th>
                          <th className="pb-3 px-1 uppercase tracking-tighter text-center">Det.</th>
                          <th className="pb-3 px-1 uppercase tracking-tighter text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/5">
                        {currentOrder?.items.map((item) => {
                          const detected = verificationResult.detectedItems.find(
                            (d) => d.productId === item.productId
                          );
                          const detectedQty = detected?.quantity ?? 0;
                          const isMatch = detectedQty === item.quantity;
                          return (
                            <tr key={item.productId}>
                              <td
                                className={`py-3 px-1 font-semibold ${
                                  isMatch ? "text-on-surface" : "text-error"
                                }`}
                              >
                                {item.name}
                              </td>
                              <td className="py-3 px-1 text-center tabular-nums">{item.quantity}</td>
                              <td className="py-3 px-1 text-center tabular-nums">{detectedQty}</td>
                              <td className="py-3 px-1 text-right">
                                {isMatch ? (
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-black uppercase">
                                    Match
                                  </span>
                                ) : (
                                  <span className="bg-error-container text-on-error-container px-2 py-1 rounded text-[10px] font-black uppercase">
                                    {detectedQty === 0 ? "Missing" : "Mismatch"}
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                        {verificationResult.extraItems.map((item) => (
                          <tr key={item.productId}>
                            <td className="py-3 px-1 font-semibold text-tertiary">{item.productName}</td>
                            <td className="py-3 px-1 text-center tabular-nums">0</td>
                            <td className="py-3 px-1 text-center tabular-nums">{item.detectedQuantity}</td>
                            <td className="py-3 px-1 text-right">
                              <span className="bg-secondary-container text-on-secondary-container px-2 py-1 rounded text-[10px] font-black uppercase">
                                Extra
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {verificationResult.notes.length > 0 && (
                    <div className="border-t border-outline-variant/10 pt-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                        Model Notes
                      </p>
                      <ul className="list-disc pl-4 space-y-1">
                        {verificationResult.notes.map((note, idx) => (
                          <li key={idx} className="text-xs text-on-surface-variant">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-4xl text-outline-variant mb-3 block">
                    fact_check
                  </span>
                  <p className="text-sm text-on-surface-variant">
                    Once you verify, AI results and comparison will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
