
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import NotificationBell from '../common/NotificationBell';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <header className={`fixed top-0 right-0 h-16 bg-white border-b border-border z-20 transition-all duration-300 ${sidebarCollapsed ? 'left-16' : 'left-64'}`}>
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по документам, рекомендациям..."
              className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <div className="flex items-center gap-3 rounded-full bg-secondary px-3 py-1.5">
            <span className="text-sm font-medium text-foreground">Ильина А.</span>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
