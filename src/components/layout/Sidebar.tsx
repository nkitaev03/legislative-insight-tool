
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
        "flex items-center gap-3 rounded-md my-1 px-3 py-2.5 text-sm transition-all duration-200",
        isCollapsed ? "justify-center" : "justify-start",
        active 
          ? "bg-white/20 text-white shadow-inner" 
          : "text-white/90 hover:bg-white/10 hover:text-white"
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
        "flex flex-col h-screen fixed top-0 left-0 z-30 transition-all duration-300 border-r border-white/10",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div 
        className={cn(
          "h-16 flex items-center justify-between px-4 border-b border-white/10",
          isCollapsed && "justify-center"
        )}
        style={{ background: "linear-gradient(135deg, #1cb16b, #11905a)" }}
      >
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <img src="/lovable-uploads/c3cc4010-d252-4d7f-bde7-dc7c9b2fe33a.png" alt="НОРМ Logo" className="h-8 w-8" />
            <div className="text-white font-bold text-lg">НОРМ</div>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white/80 p-1.5 rounded-md hover:bg-white/10 transition-colors"
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
        style={{ background: "linear-gradient(180deg, #1cb16b, #11774a)" }}
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
          "p-4 border-t border-white/10",
          isCollapsed ? "text-center" : ""
        )}
        style={{ background: "linear-gradient(0deg, #116445, #117a4d)" }}
      >
        {!isCollapsed && (
          <div className="text-xs text-white/60 flex items-center justify-between">
            <span>Версия 1.0.0</span>
            <span className="px-2 py-0.5 rounded bg-white/20 text-white text-xs">Beta</span>
          </div>
        )}
      </div>
    </div>
  );
}
