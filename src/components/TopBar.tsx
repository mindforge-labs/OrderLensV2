"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = { label: string; href: string };

interface TopBarProps {
  navItems?: NavItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
}

const defaultNavItems: NavItem[] = [
  { label: "Tray Audit", href: "/tray-audit" },
  { label: "History", href: "/transaction-history" },
  { label: "Insights", href: "/operational-insights" },
];

export default function TopBar({
  navItems = defaultNavItems,
  showSearch = true,
  searchPlaceholder = "Search...",
}: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="w-full top-0 sticky bg-slate-50 border-b border-slate-200/50 shadow-sm z-50">
      <div className="flex justify-between items-center w-full px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/pos-tray-verification" className="text-xl font-bold tracking-tighter text-slate-900">
            OrderLens
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={
                    isActive
                      ? "text-blue-600 font-semibold border-b-2 border-blue-600 transition-colors py-1"
                      : "text-slate-500 hover:text-slate-800 transition-colors py-1"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {showSearch && (
            <div className="relative hidden lg:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm">
                search
              </span>
              <input
                className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 w-64 outline-none"
                placeholder={searchPlaceholder}
                type="text"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <button className="p-2 text-on-surface-variant hover:bg-slate-100 transition-colors rounded-full">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-slate-100 transition-colors rounded-full">
              <span className="material-symbols-outlined">settings</span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden ml-2 border border-outline-variant/30 bg-primary-container flex items-center justify-center text-on-primary-container text-xs font-bold">
              SA
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
