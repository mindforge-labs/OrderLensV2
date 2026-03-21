"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const AUDIT_ITEMS = [
  {
    id: "#AUD-98214",
    time: "14:23:45",
    terminal: "T-04",
    confidence: 98.4,
    status: "Passed" as const,
    orderId: "ORD-2026-A",
    items: ["Snack Red ×2", "Cola Can ×1", "Water Bottle ×1"],
  },
  {
    id: "#AUD-98209",
    time: "14:18:12",
    terminal: "T-01",
    confidence: 64.2,
    status: "Flagged" as const,
    orderId: "ORD-2026-B",
    items: ["Snack Blue ×1"],
  },
  {
    id: "#AUD-98192",
    time: "14:02:59",
    terminal: "T-04",
    confidence: 99.1,
    status: "Passed" as const,
    orderId: "ORD-2026-C",
    items: ["Cola Can ×2", "Snack Red ×1"],
  },
  {
    id: "#AUD-98180",
    time: "13:54:01",
    terminal: "T-02",
    confidence: 96.7,
    status: "Passed" as const,
    orderId: "ORD-2026-D",
    items: ["Water Bottle ×3"],
  },
  {
    id: "#AUD-98171",
    time: "13:47:33",
    terminal: "T-01",
    confidence: 41.0,
    status: "Flagged" as const,
    orderId: "ORD-2026-E",
    items: ["Snack Red ×1", "Snack Blue ×2"],
  },
];

export default function TrayAuditPage() {
  const [selectedId, setSelectedId] = useState<string>("#AUD-98214");
  const [filterStatus, setFilterStatus] = useState("All Audits");
  const [filterTerminal, setFilterTerminal] = useState("All Terminals");

  const selectedItem = AUDIT_ITEMS.find((a) => a.id === selectedId);

  const filtered = AUDIT_ITEMS.filter((a) => {
    const statusMatch =
      filterStatus === "All Audits" ||
      (filterStatus === "Passed Only" && a.status === "Passed") ||
      (filterStatus === "Flagged" && a.status === "Flagged");
    const terminalMatch =
      filterTerminal === "All Terminals" || a.terminal === filterTerminal;
    return statusMatch && terminalMatch;
  });

  return (
    <AppShell>
      <div className="flex h-full overflow-hidden">
        {/* Audit Log */}
        <section className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col gap-8 mb-10">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-on-surface mb-2">
                  Tray Audit Log
                </h1>
                <p className="text-on-surface-variant text-sm">
                  Review real-time AI verification results and flagged deviations.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-4 bg-surface-container-low p-4 rounded-xl">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
                    Status:
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-surface-container-lowest border-none rounded-lg text-sm py-1.5 px-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>All Audits</option>
                    <option>Passed Only</option>
                    <option>Flagged</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-tighter">
                    Terminal:
                  </label>
                  <select
                    value={filterTerminal}
                    onChange={(e) => setFilterTerminal(e.target.value)}
                    className="bg-surface-container-lowest border-none rounded-lg text-sm py-1.5 px-2 focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option>All Terminals</option>
                    <option>T-01</option>
                    <option>T-02</option>
                    <option>T-04</option>
                  </select>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <button className="flex items-center gap-2 bg-surface-container-high text-on-surface-variant px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    <span>Today</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Audit Cards */}
            <div className="grid gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`group relative bg-surface-container-lowest p-6 rounded-xl shadow-sm transition-all cursor-pointer ${
                    selectedId === item.id
                      ? "border-l-4 border-primary ring-1 ring-primary/10"
                      : "hover:bg-surface-container-low border-l-4 border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">
                          Order ID
                        </span>
                        <span className="font-bold text-lg tabular-nums">{item.id}</span>
                      </div>
                      <div className="h-8 w-px bg-outline-variant/30"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">
                          Timestamp
                        </span>
                        <span className="text-sm text-on-surface-variant tabular-nums">
                          {item.time}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-outline-variant/30"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">
                          Terminal
                        </span>
                        <span className="text-sm font-bold text-on-surface">{item.terminal}</span>
                      </div>
                      <div className="h-8 w-px bg-outline-variant/30"></div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-outline uppercase tracking-wider mb-1">
                          Confidence
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold tabular-nums ${
                              item.confidence >= 80 ? "text-primary" : "text-error"
                            }`}
                          >
                            {item.confidence}%
                          </span>
                          <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.confidence >= 80 ? "bg-primary" : "bg-error"
                              }`}
                              style={{ width: `${item.confidence}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {item.status === "Passed" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Passed
                        </span>
                      ) : (
                        <span className="bg-error-container text-on-error-container px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          Flagged
                        </span>
                      )}
                      <button
                        className={`p-2 rounded-full transition-colors ${
                          selectedId === item.id
                            ? "text-primary hover:bg-primary/5"
                            : "text-outline hover:bg-slate-100"
                        }`}
                      >
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Detail Panel */}
        {selectedItem && (
          <aside className="w-80 bg-surface-container-lowest border-l border-outline-variant/10 p-6 overflow-y-auto flex-shrink-0 hidden xl:block">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-on-surface">Audit Detail</h3>
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                  selectedItem.status === "Passed"
                    ? "bg-green-100 text-green-700"
                    : "bg-error-container text-on-error-container"
                }`}
              >
                {selectedItem.status}
              </span>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Audit ID
                </p>
                <p className="font-mono font-bold text-on-surface">{selectedItem.id}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">
                  Order Reference
                </p>
                <p className="font-bold text-on-surface">{selectedItem.orderId}</p>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  AI Confidence Score
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        selectedItem.confidence >= 80 ? "bg-primary" : "bg-error"
                      }`}
                      style={{ width: `${selectedItem.confidence}%` }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-bold tabular-nums ${
                      selectedItem.confidence >= 80 ? "text-primary" : "text-error"
                    }`}
                  >
                    {selectedItem.confidence}%
                  </span>
                </div>
              </div>
              <div className="bg-surface-container-low rounded-xl p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                  Detected Items
                </p>
                <ul className="space-y-1">
                  {selectedItem.items.map((item) => (
                    <li key={item} className="text-sm text-on-surface flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full velocity-gradient text-on-primary py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">
                View Full Report
              </button>
            </div>
          </aside>
        )}
      </div>
    </AppShell>
  );
}
