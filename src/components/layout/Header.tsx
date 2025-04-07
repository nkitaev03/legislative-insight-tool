
import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import { Button } from '@/components/ui/button';
import VoiceSearch from '../common/VoiceSearch';
import { ThemeToggle } from '../theme/ThemeToggle';
import QuickTaskAssignment from '../common/QuickTaskAssignment';
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
                placeholder="Я твой ИИ помощник" 
                className="pl-9 pr-4 h-10 rounded-xl border-border bg-background"
              />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3">
            <Button variant="secondary" size="sm" className="rounded-xl">
              Зарегистрировать событие
            </Button>
            <Button variant="secondary" size="sm" className="rounded-xl">
              Выявить новые риски
            </Button>
            <Button variant="secondary" size="sm" className="rounded-xl">
              Запросить аналитику
            </Button>
          </div>
          
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
