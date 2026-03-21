import TopBar from "./TopBar";
import SideNav from "./SideNav";

interface AppShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function AppShell({ children, className = "" }: AppShellProps) {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <TopBar />
      <div className={`flex flex-1 overflow-hidden ${className}`}>
        <SideNav />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
