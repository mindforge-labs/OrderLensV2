"use client";

import { useState } from "react";
import TopBar from "./TopBar";
import SideNav from "./SideNav";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({ children, className = "" }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />
      <div className={`flex flex-1 overflow-hidden ${className}`}>
        <SideNav collapsed={sidebarCollapsed} />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
