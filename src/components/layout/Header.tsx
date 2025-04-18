
import React from 'react';
import { Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  sidebarCollapsed: boolean;
}

export default function Header({ sidebarCollapsed }: HeaderProps) {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    navigate('/profile');
  };
  
  return (
    <header 
      className={`fixed top-0 right-0 h-16 bg-background border-b border-border z-20 transition-all duration-300 ${
        sidebarCollapsed ? 'left-16' : 'left-64'
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1">
          <div className="max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input 
                type="text" 
                placeholder="Поиск по документам" 
                className="pl-9 pr-4 h-10 rounded-xl border-border bg-background"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <NotificationBell />
          
          <div 
            className="flex items-center gap-3 rounded-xl bg-secondary px-4 py-2 cursor-pointer hover:bg-secondary/80 transition-colors"
            onClick={handleProfileClick}
          >
            <span className="text-sm font-medium text-secondary-foreground">Ильина А.</span>
            <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-sm">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
