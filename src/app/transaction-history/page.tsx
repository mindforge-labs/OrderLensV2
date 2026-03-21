"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

type TransactionStatus = "Complete" | "Pending" | "Failed";
type TransactionType = "Order" | "Scan" | "Audit";

type Transaction = {
  id: string;
  datetime: string;
  type: TransactionType;
  staff: string;
  amount: string | null;
  status: TransactionStatus;
};

const TRANSACTIONS: Transaction[] = [
  { id: "#TRX-99421-B", datetime: "Oct 24, 2023 · 14:32:11", type: "Order", staff: "Alex Miller", amount: "$142.50", status: "Complete" },
  { id: "#TRX-99419-V", datetime: "Oct 24, 2023 · 14:15:04", type: "Scan", staff: "Sarah Klein", amount: null, status: "Complete" },
  { id: "#TRX-99415-A", datetime: "Oct 24, 2023 · 13:58:22", type: "Audit", staff: "System Auto-Audit", amount: null, status: "Pending" },
  { id: "#TRX-99408-B", datetime: "Oct 24, 2023 · 13:42:10", type: "Order", staff: "John Lewis", amount: "$892.15", status: "Failed" },
  { id: "#TRX-99401-V", datetime: "Oct 24, 2023 · 13:30:55", type: "Scan", staff: "Sarah Klein", amount: null, status: "Complete" },
  { id: "#TRX-99392-B", datetime: "Oct 24, 2023 · 13:12:44", type: "Order", staff: "Alex Miller", amount: "$58.90", status: "Complete" },
  { id: "#TRX-99385-A", datetime: "Oct 24, 2023 · 12:58:03", type: "Audit", staff: "System Auto-Audit", amount: null, status: "Complete" },
  { id: "#TRX-99374-B", datetime: "Oct 24, 2023 · 12:41:19", type: "Order", staff: "Maria Costa", amount: "$310.00", status: "Complete" },
  { id: "#TRX-99361-V", datetime: "Oct 24, 2023 · 12:24:07", type: "Scan", staff: "John Lewis", amount: null, status: "Failed" },
  { id: "#TRX-99350-B", datetime: "Oct 24, 2023 · 12:08:50", type: "Order", staff: "Maria Costa", amount: "$77.25", status: "Complete" },
];

const STATUS_STYLES: Record<TransactionStatus, string> = {
  Complete: "bg-tertiary-fixed text-on-tertiary-fixed",
  Pending: "bg-secondary-container text-on-secondary-container",
  Failed: "bg-error-container text-on-error-container",
};

const TYPE_ICONS: Record<TransactionType, string> = {
  Order: "shopping_cart",
  Scan: "view_in_ar",
  Audit: "fact_check",
};

const TABS = ["All Sessions", "POS Orders", "Tray Verifications", "System Alerts"];

export default function TransactionHistoryPage() {
  const [activeTab, setActiveTab] = useState("All Sessions");

  const filtered = TRANSACTIONS.filter((t) => {
    if (activeTab === "POS Orders") return t.type === "Order";
    if (activeTab === "Tray Verifications") return t.type === "Scan";
    if (activeTab === "System Alerts") return t.status === "Failed" || t.status === "Pending";
    return true;
  });

  return (
    <AppShell>
      <div className="p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-[2.75rem] font-bold tracking-tight text-on-surface leading-tight mb-2">
              System Transaction History
            </h1>
            <p className="text-on-surface-variant text-lg">
              A comprehensive chronological record of all system activity and AI verifications.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-surface-container-high text-primary rounded-full font-semibold transition-colors hover:bg-surface-container-highest text-sm">
              <span className="material-symbols-outlined text-sm">download</span>
              Export CSV/PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-outline-variant/15 flex items-center justify-between">
          <div className="flex gap-8">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={
                  activeTab === tab
                    ? "pb-4 text-primary font-semibold border-b-2 border-primary text-sm tracking-wide uppercase flex items-center gap-2"
                    : "pb-4 text-on-surface-variant hover:text-on-surface font-medium text-sm tracking-wide uppercase transition-colors flex items-center gap-2"
                }
              >
                {tab}
                {tab === "System Alerts" && (
                  <span className="w-5 h-5 flex items-center justify-center bg-error-container text-on-error-container text-[10px] font-bold rounded-full">
                    3
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="pb-4">
            <button className="flex items-center gap-2 text-on-surface-variant text-sm hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface-variant">
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Date / Time
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Staff Member
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-[0.6875rem] font-semibold uppercase tracking-wider text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filtered.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-surface-container-low/50 transition-colors"
                >
                  <td className="px-6 py-5 tabular-nums text-sm font-medium">{tx.datetime}</td>
                  <td className="px-6 py-5 tabular-nums text-sm font-mono text-primary font-semibold">
                    {tx.id}
                  </td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="material-symbols-outlined text-slate-400 text-lg">
                        {TYPE_ICONS[tx.type]}
                      </span>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-[10px] font-bold text-on-primary-fixed flex-shrink-0">
                        {tx.staff === "System Auto-Audit"
                          ? "SY"
                          : tx.staff.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className={`text-sm ${tx.staff === "System Auto-Audit" ? "italic" : ""}`}>
                        {tx.staff}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 tabular-nums text-sm font-semibold">
                    {tx.amount ?? (
                      <span className="text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase ${STATUS_STYLES[tx.status]}`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                      <span className="material-symbols-outlined text-on-surface-variant">
                        more_vert
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              Showing {filtered.length} of {TRANSACTIONS.length} transactions
            </p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-on-primary text-xs font-bold">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors text-xs">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors text-xs">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-on-surface-variant hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
