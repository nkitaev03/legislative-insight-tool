
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileSearch, 
  Play, 
  Clipboard,
  ChevronLeft,
  ChevronRight,
  User,
  Home
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
        "flex items-center gap-3 rounded-lg my-1 px-3 py-2.5 text-sm transition-all duration-200",
        isCollapsed ? "justify-center" : "justify-start",
        active 
          ? "bg-primary/10 text-primary font-medium" 
          : "text-foreground/70 hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "text-primary")} />
      {!isCollapsed && <span>{text}</span>}
    </Link>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { icon: Home, text: "Главная", path: "/" },
    { icon: FileSearch, text: "Мониторинг", path: "/monitoring" },
    { icon: Play, text: "Симуляция", path: "/simulation" },
    { icon: Clipboard, text: "Аудит", path: "/audit" },
    { icon: User, text: "Личный кабинет", path: "/profile" },
  ];

  return (
    <div 
      className={cn(
        "flex flex-col h-screen fixed top-0 left-0 z-30 transition-all duration-300 border-r border-border bg-white dark:bg-card",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div 
        className={cn(
          "h-16 flex items-center justify-between px-4 border-b border-border",
          isCollapsed && "justify-center"
        )}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">RiskAI</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-muted-foreground p-1.5 rounded-md hover:bg-muted transition-colors"
          data-testid="sidebar-toggle"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex-1 overflow-auto py-6 px-3">
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
          "p-4 border-t border-border",
          isCollapsed ? "text-center" : ""
        )}
      >
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground flex items-center justify-between">
            <span>Версия 1.0.0</span>
            <span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">Beta</span>
          </div>
        )}
      </div>
    </div>
  );
}
