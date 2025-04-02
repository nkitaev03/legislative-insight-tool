
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardPage from '@/components/dashboard/DashboardPage';
import MonitoringPage from '@/components/monitoring/MonitoringPage';
import ChatSupport from '@/components/common/ChatSupport';
import { useToast } from '@/components/ui/use-toast';

export default function Index() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const { toast } = useToast();

  // Show welcome toast on first render
  useEffect(() => {
    toast({
      title: "Добро пожаловать в ComplianceAI",
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
        return (
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Симуляция</h1>
            <div className="bg-mesh-gradient rounded-lg p-8 text-center shadow-md">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-24 w-24 bg-compBlue-500 rounded-full mx-auto flex items-center justify-center">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-xl font-medium">Симулятор воздействия законодательных изменений</h2>
                <p className="text-muted-foreground">
                  Здесь вы сможете моделировать влияние изменений в законодательстве на ваш бизнес и 
                  тестировать различные сценарии реагирования.
                </p>
                <button className="px-4 py-2 bg-compBlue-500 text-white rounded-full hover:bg-compBlue-600 transition-colors">
                  Начать симуляцию
                </button>
              </div>
            </div>
          </div>
        );
      case '/audit':
        return (
          <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Аудит</h1>
            <div className="bg-mesh-gradient rounded-lg p-8 text-center shadow-md">
              <div className="max-w-md mx-auto space-y-4">
                <div className="h-24 w-24 bg-compPurple-500 rounded-full mx-auto flex items-center justify-center">
                  <Clipboard className="h-10 w-10 text-white" />
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
