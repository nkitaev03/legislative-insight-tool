import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardPage from '@/components/dashboard/DashboardPage';
import MonitoringPage from '@/components/monitoring/MonitoringPage';
import SimulationPage from '@/components/simulation/SimulationPage';
import ProfilePage from '@/components/profile/ProfilePage';
import ChatSupport from '@/components/common/ChatSupport';
import { useToast } from '@/components/ui/use-toast';

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  // Listen for sidebar toggle events
  useEffect(() => {
    const handleSidebarToggle = () => {
      const toggleButton = document.querySelector('[data-testid="sidebar-toggle"]');
      if (toggleButton) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach(() => {
            const isCollapsed = toggleButton.parentElement?.parentElement?.classList.contains('w-16') || false;
            setSidebarCollapsed(isCollapsed);
          });
        });
        observer.observe(toggleButton.parentElement.parentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
      }
    };
    
    handleSidebarToggle();
  }, []);

  // Show welcome toast on first render
  useEffect(() => {
    toast({
      title: "Добро пожаловать в НОРМ",
      description: "У вас 2 новых уведомления об изменениях в законодательстве",
      className: "bg-white border-l-4 border-compGreen-500",
    });
  }, []);

  // Determine which page to show based on path
  const renderPageContent = () => {
    const path = location.pathname;
    
    // Default to dashboard
    if (path === '/') {
      return <DashboardPage />;
    }
    
    // Other paths
    switch (path) {
      case '/monitoring':
        return <MonitoringPage />;
      case '/simulation':
        return <SimulationPage />;
      case '/audit':
        return (
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Аудит</h1>
            <div className="bg-mesh-gradient rounded-lg p-8 text-center shadow-md">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-24 w-24 bg-compPurple-500 rounded-full mx-auto flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-10 w-10">
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                    <path d="m9 14 2 2 4-4"></path>
                  </svg>
                </div>
                <h2 className="text-xl font-medium">Интеллектуальная система аудита</h2>
                <p className="text-muted-foreground">
                  Автоматизированная проверка соответствия внутренних документов требованиям 
                  законодательства с применением искусственного интеллекта.
                </p>
                <button className="px-4 py-2 bg-compPurple-500 text-white rounded-full hover:bg-compPurple-600 transition-colors">
                  Запустить аудит
                </button>
              </div>
            </div>
          </div>
        );
      case '/profile':
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div 
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />
        <main className="pt-16 min-h-[calc(100vh-4rem)]">
          {renderPageContent()}
        </main>
      </div>
      <ChatSupport />
    </div>
  );
}
