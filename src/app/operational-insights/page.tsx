"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

const KPI_CARDS = [
  {
    label: "Total Scans",
    value: "14,282",
    delta: "+12%",
    deltaPositive: true,
    sub: "vs last period",
    icon: "barcode_scanner",
    borderColor: "border-primary/10",
  },
  {
    label: "AI Accuracy %",
    value: "99.4%",
    delta: "+0.2%",
    deltaPositive: true,
    sub: "Optimal baseline",
    icon: "verified",
    borderColor: "border-primary/10",
  },
  {
    label: "Mismatch Rate",
    value: "0.58%",
    delta: "-4%",
    deltaPositive: false,
    sub: "improvement",
    icon: "warning",
    borderColor: "border-error/10",
    iconColor: "text-error",
  },
  {
    label: "Peak Verification Time",
    value: "1.2s",
    delta: null,
    deltaPositive: true,
    sub: "Stable performance",
    icon: "timer",
    borderColor: "border-primary/10",
  },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const CHART_POINTS = [
  { x: "12.5%", y: "25%" },
  { x: "27%", y: "32%" },
  { x: "42%", y: "55%" },
  { x: "57%", y: "45%" },
  { x: "72%", y: "65%" },
  { x: "87%", y: "58%" },
  { x: "98%", y: "80%" },
];

const FLAGGED_TERMINALS = [
  { terminal: "T-01", count: 12, pct: 85, color: "bg-error" },
  { terminal: "T-02", count: 4, pct: 30, color: "bg-primary" },
  { terminal: "T-03", count: 8, pct: 60, color: "bg-tertiary" },
  { terminal: "T-04", count: 2, pct: 15, color: "bg-primary" },
];

const ITEM_ACCURACY = [
  { name: "Snack Red", accuracy: 99.8, scans: 4210 },
  { name: "Cola Can", accuracy: 98.5, scans: 3890 },
  { name: "Water Bottle", accuracy: 99.1, scans: 3540 },
  { name: "Snack Blue", accuracy: 97.3, scans: 2640 },
];

const RECENT_ALERTS = [
  { id: "#AUD-98209", terminal: "T-01", issue: "Missing item: Cola Can", time: "14:18" },
  { id: "#AUD-98171", terminal: "T-01", issue: "Low confidence: 41%", time: "13:47" },
  { id: "#TRX-99408", terminal: "T-02", issue: "Order processing failed", time: "13:42" },
];

export default function OperationalInsightsPage() {
  const [activePeriod, setActivePeriod] = useState("Last 7 Days");
  const [activeTerminal, setActiveTerminal] = useState("All Terminals");

  return (
    <AppShell>
      <div className="p-8 bg-surface">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-on-surface mb-1">
              Operational Insights
            </h1>
            <p className="text-on-surface-variant text-sm">
              Detailed performance metrics for terminal fleet and AI verification accuracy.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-surface-container-high p-1 rounded-full">
              {["Last 7 Days", "30 Days", "Custom"].map((period) => (
                <button
                  key={period}
                  onClick={() => setActivePeriod(period)}
                  className={
                    activePeriod === period
                      ? "px-4 py-1.5 text-xs font-semibold rounded-full bg-white shadow-sm text-primary"
                      : "px-4 py-1.5 text-xs font-medium text-on-surface-variant hover:text-on-surface"
                  }
                >
                  {period}
                </button>
              ))}
            </div>
            <div className="relative">
              <select
                value={activeTerminal}
                onChange={(e) => setActiveTerminal(e.target.value)}
                className="appearance-none bg-surface-container-high border-none rounded-full px-5 py-2 text-xs font-semibold text-on-surface pr-10 focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
              >
                <option>All Terminals</option>
                <option>Terminal 01</option>
                <option>Terminal 02</option>
                <option>Terminal 04 (Active)</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {KPI_CARDS.map((kpi) => (
            <div
              key={kpi.label}
              className={`bg-surface-container-lowest p-6 rounded-xl border-b-4 ${kpi.borderColor}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/60">
                  {kpi.label}
                </span>
                <span
                  className={`material-symbols-outlined text-xl ${kpi.iconColor ?? "text-primary"}`}
                >
                  {kpi.icon}
                </span>
              </div>
              <div className="text-3xl font-bold tabular-nums text-on-surface">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {kpi.delta && (
                  <span
                    className={`text-xs font-semibold ${
                      kpi.deltaPositive ? "text-green-600" : "text-error"
                    }`}
                  >
                    {kpi.delta}
                  </span>
                )}
                <span className="text-[10px] text-on-surface-variant">{kpi.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Accuracy Over Time — spans 8 cols */}
          <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-semibold">Accuracy Over Time</h3>
                <p className="text-xs text-on-surface-variant">
                  Daily precision intervals for current selection
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-[10px] font-medium text-on-surface-variant uppercase">
                  AI Baseline
                </span>
              </div>
            </div>

            <div className="h-48 relative">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-full border-t border-dashed border-outline-variant/10"></div>
                ))}
              </div>

              {/* SVG line chart */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="gradient-blue" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" style={{ stopColor: "#0058be", stopOpacity: 0.2 }} />
                    <stop offset="100%" style={{ stopColor: "#0058be", stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="fill-gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                    <stop offset="0%" style={{ stopColor: "#0058be", stopOpacity: 0.12 }} />
                    <stop offset="100%" style={{ stopColor: "#0058be", stopOpacity: 0 }} />
                  </linearGradient>
                </defs>
                {/* Fill area */}
                <path
                  d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40 L800,200 L0,200 Z"
                  fill="url(#fill-gradient)"
                />
                {/* Line */}
                <path
                  d="M0,150 Q100,120 200,140 T400,80 T600,100 T800,40"
                  fill="none"
                  stroke="url(#gradient-blue)"
                  strokeWidth="2.5"
                />
                {/* Data points */}
                {[
                  [100, 120],
                  [200, 140],
                  [400, 80],
                  [600, 100],
                  [800, 40],
                ].map(([cx, cy], i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="#0058be"
                    filter="drop-shadow(0 0 4px rgba(0,88,190,0.5))"
                  />
                ))}
              </svg>
            </div>

            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter">
              {WEEK_DAYS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>

          {/* Flagged Trays Heatmap — 4 cols */}
          <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest p-8 rounded-xl flex flex-col">
            <h3 className="text-lg font-semibold mb-1">Flagged Trays</h3>
            <p className="text-xs text-on-surface-variant mb-6">Heatmap by Terminal load</p>
            <div className="flex-grow grid grid-cols-2 gap-3">
              {FLAGGED_TERMINALS.map((t) => (
                <div
                  key={t.terminal}
                  className={`bg-surface-container-low rounded-lg p-4 flex flex-col justify-between border-l-4 ${
                    t.pct > 70 ? "border-error" : "border-primary"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase text-on-surface-variant">
                    {t.terminal}
                  </span>
                  <div className="text-2xl font-bold tabular-nums">
                    {String(t.count).padStart(2, "0")}
                  </div>
                  <div className="w-full bg-surface-container-highest h-1 rounded-full mt-2">
                    <div
                      className={`h-full rounded-full ${t.color}`}
                      style={{ width: `${t.pct}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Item Accuracy Table — 6 cols */}
          <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-8 rounded-xl">
            <h3 className="text-lg font-semibold mb-1">Per-Item AI Accuracy</h3>
            <p className="text-xs text-on-surface-variant mb-6">Detection performance by product SKU</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-outline-variant/10 text-on-surface-variant font-bold uppercase tracking-wider">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-center">Scans</th>
                    <th className="pb-3">Accuracy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {ITEM_ACCURACY.map((item) => (
                    <tr key={item.name}>
                      <td className="py-3 font-medium text-on-surface">{item.name}</td>
                      <td className="py-3 text-center tabular-nums text-on-surface-variant">
                        {item.scans.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                item.accuracy >= 99 ? "bg-green-500" : item.accuracy >= 97 ? "bg-primary" : "bg-tertiary"
                              }`}
                              style={{ width: `${item.accuracy}%` }}
                            ></div>
                          </div>
                          <span className="tabular-nums font-bold text-on-surface w-12">
                            {item.accuracy}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Alerts — 6 cols */}
          <div className="col-span-12 lg:col-span-6 bg-surface-container-lowest p-8 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold">Recent Alerts</h3>
                <p className="text-xs text-on-surface-variant">Flagged events requiring attention</p>
              </div>
              <span className="w-6 h-6 flex items-center justify-center bg-error-container text-on-error-container text-[10px] font-bold rounded-full">
                {RECENT_ALERTS.length}
              </span>
            </div>
            <div className="space-y-3">
              {RECENT_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 bg-error-container/20 border border-error/10 rounded-xl"
                >
                  <span
                    className="material-symbols-outlined text-error mt-0.5"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    warning
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-primary">{alert.id}</span>
                      <span className="text-[10px] text-on-surface-variant tabular-nums">
                        {alert.time}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface truncate">{alert.issue}</p>
                    <p className="text-[10px] text-on-surface-variant mt-0.5">
                      Terminal: {alert.terminal}
                    </p>
                  </div>
                  <button className="text-on-surface-variant hover:text-on-surface transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full text-xs font-semibold text-primary hover:text-primary-container transition-colors flex items-center justify-center gap-1 py-2">
              View All Alerts
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
