
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileSearch, 
  Play, 
  Clipboard, 
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  text: string;
  path: string;
  isCollapsed: boolean;
  active?: boolean;
}

const SidebarItem = ({ icon: Icon, text, path, isCollapsed, active }: SidebarItemProps) => {
  return (
    <Link
      to={path}
      className={cn(
        "flex items-center gap-3 rounded-md my-1 px-3 py-2.5 text-sm transition-all duration-200",
        isCollapsed ? "justify-center" : "justify-start",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-inner" 
          : "text-sidebar-foreground/90 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "text-white")} />
      {!isCollapsed && <span>{text}</span>}
    </Link>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: BarChart3, text: "Дашборд", path: "/" },
    { icon: FileSearch, text: "Мониторинг", path: "/monitoring" },
    { icon: Play, text: "Симуляция", path: "/simulation" },
    { icon: Clipboard, text: "Аудит", path: "/audit" },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen fixed top-0 left-0 z-30 transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div 
        className={cn(
          "h-16 flex items-center justify-between px-4 border-b border-sidebar-border",
          isCollapsed && "justify-center"
        )}
        style={{ background: "linear-gradient(135deg, hsl(142, 70%, 16%), hsl(142, 70%, 20%))" }}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-compGreen-300" />
            <div className="text-sidebar-foreground font-bold text-lg">ComplianceAI</div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground/80 p-1.5 rounded-md hover:bg-sidebar-accent/50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div 
        className="flex-1 overflow-auto py-6 px-3"
        style={{ background: "linear-gradient(180deg, hsl(142, 70%, 16%), hsl(142, 65%, 14%))" }}
      >
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.path}
              icon={item.icon}
              text={item.text}
              path={item.path}
              isCollapsed={isCollapsed}
              active={location.pathname === item.path}
            />
          ))}
        </nav>
      </div>
      
      <div 
        className={cn(
          "p-4 border-t border-sidebar-border",
          isCollapsed ? "text-center" : ""
        )}
        style={{ background: "linear-gradient(0deg, hsl(142, 70%, 14%), hsl(142, 65%, 16%))" }}
      >
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/60 flex items-center justify-between">
            <span>Версия 1.0.0</span>
            <span className="px-2 py-0.5 rounded bg-compGreen-500/20 text-compGreen-300 text-xs">Beta</span>
          </div>
        )}
      </div>
    </div>
  );
}
