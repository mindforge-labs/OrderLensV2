"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Command Center", href: "/pos-tray-verification", icon: "dashboard" },
  { label: "POS Terminal", href: "/pos-terminal", icon: "point_of_sale" },
  { label: "Tray Audit", href: "/tray-audit", icon: "view_in_ar" },
  { label: "History", href: "/transaction-history", icon: "history" },
  { label: "Insights", href: "/operational-insights", icon: "analytics" },
];

export default function SideNav() {
  const pathname = usePathname();

  return (
    <aside className="h-full w-64 bg-slate-100 flex flex-col py-6 border-r border-slate-200 hidden lg:flex flex-shrink-0">
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 p-3 bg-white/50 rounded-xl">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-400">
              System Status
            </p>
            <p className="font-bold text-slate-900 text-sm">Terminal 04</p>
            <p className="text-[10px] text-blue-600">AI Core: Active</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                isActive
                  ? "flex items-center gap-3 px-4 py-3 bg-white text-blue-600 rounded-lg mx-2 shadow-sm transition-all duration-200"
                  : "flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg mx-2 transition-all duration-200"
              }
            >
              <span
                className="material-symbols-outlined text-sm"
                style={
                  isActive
                    ? { fontVariationSettings: "'FILL' 1" }
                    : undefined
                }
              >
                {item.icon}
              </span>
              <span className="text-xs font-medium uppercase tracking-widest">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mb-6">
        <Link
          href="/pos-tray-verification"
          className="w-full velocity-gradient text-white py-2.5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity text-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Scan
        </Link>
      </div>

      <div className="mt-auto border-t border-slate-200 pt-4 space-y-1">
        <a
          href="#"
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg mx-2 transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-sm">help_outline</span>
          <span>Support</span>
        </a>
        <Link
          href="/login"
          className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 rounded-lg mx-2 transition-all text-sm font-medium"
        >
          <span className="material-symbols-outlined text-sm">logout</span>
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
