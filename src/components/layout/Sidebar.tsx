
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileSearch, 
  Play, 
  Clipboard, 
  ChevronLeft,
  ChevronRight,
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
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isCollapsed ? "justify-center" : "justify-start",
        active 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
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
        "flex flex-col h-screen bg-sidebar fixed top-0 left-0 z-30 transition-all duration-300 border-r border-sidebar-border",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center justify-between h-16 px-4 border-b border-sidebar-border",
        isCollapsed && "justify-center"
      )}>
        {!isCollapsed && (
          <div className="text-sidebar-foreground font-bold text-lg">ComplianceAI</div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-sidebar-foreground/80 p-1 rounded-md hover:bg-sidebar-accent/50"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 px-2">
        <nav className="space-y-1">
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
      
      <div className={cn(
        "p-4 border-t border-sidebar-border",
        isCollapsed ? "text-center" : ""
      )}>
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/60">
            Версия 1.0.0
          </div>
        )}
      </div>
    </div>
  );
}
