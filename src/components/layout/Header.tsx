
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-white border-b border-border z-20 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1">
          <div className="relative max-w-md">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Поиск по документам, рекомендациям..."
              className="w-full rounded-full border border-input bg-background pl-10 pr-4 py-2 text-sm transition-all duration-200 focus:ring-2 focus:ring-accent/50 focus:border-accent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <NotificationBell />
          
          <div 
            className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2 shadow-sm cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={handleProfileClick}
          >
            <span className="text-sm font-medium text-secondary-foreground">Ильина А.</span>
            <div className="h-8 w-8 rounded-full bg-compGreen-500 text-white flex items-center justify-center shadow-md">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
