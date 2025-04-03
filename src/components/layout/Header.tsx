
import React, { useState } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from '../common/NotificationBell';
import { Button } from '@/components/ui/button';
import VoiceSearch from '../common/VoiceSearch';
import { ThemeToggle } from '../theme/ThemeToggle';
import QuickTaskAssignment from '../common/QuickTaskAssignment';

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
          <div className="flex items-center gap-4">
            <VoiceSearch onSearch={(query) => console.log('Search query:', query)} />
            <QuickTaskAssignment buttonVariant="outline" buttonSize="sm" />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
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
