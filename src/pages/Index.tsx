
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-white">85%</span>
                </div>
                <h3 className="font-medium">Маркетинг</h3>
                <p className="text-sm text-muted-foreground">Хорошее соответствие</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-white">92%</span>
                </div>
                <h3 className="font-medium">Продажи</h3>
                <p className="text-sm text-muted-foreground">Отличное соответствие</p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-amber-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-white">68%</span>
                </div>
                <h3 className="font-medium">Финансы</h3>
                <p className="text-sm text-muted-foreground">Требует внимания</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                  <span className="text-xl font-bold text-white">58%</span>
                </div>
                <h3 className="font-medium">Бизнес-процессы</h3>
                <p className="text-sm text-muted-foreground">Требует улучшения</p>
              </div>
            </div>
            
            <div className="bg-mesh-gradient rounded-lg p-8 text-center shadow-md mb-6">
              <div className="max-w-md mx-auto space-y-4">
                <div className="flex justify-center">
                  <div className="h-24 w-24 bg-compPurple-500 rounded-full flex items-center justify-center relative">
                    <span className="text-2xl font-bold text-white">76%</span>
                    <svg className="absolute -top-2 -right-2 h-8 w-8 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-xl font-medium">Общая оценка соответствия</h2>
                <p className="text-muted-foreground">
                  Ваша компания имеет средний уровень соответствия нормативным требованиям. 
                  Есть области, требующие улучшения.
                </p>
                <button className="px-4 py-2 bg-compPurple-500 text-white rounded-full hover:bg-compPurple-600 transition-colors">
                  Подробный отчет
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Рекомендации по улучшению</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Финансы</h4>
                      <span className="bg-amber-500 text-white px-2 py-0.5 rounded-full text-xs">Средний приоритет</span>
                    </div>
                    <p className="text-sm mt-2">Обновить учетную политику в соответствии с последними изменениями в МСФО.</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Бизнес-процессы</h4>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">Высокий приоритет</span>
                    </div>
                    <p className="text-sm mt-2">Внедрить систему контроля процесса закупок и выбора поставщиков.</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex justify-between">
                      <h4 className="font-medium">Бизнес-процессы</h4>
                      <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">Высокий приоритет</span>
                    </div>
                    <p className="text-sm mt-2">Разработать и внедрить политику по управлению конфликтами интересов.</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white border rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Динамика соответствия</h3>
                <div className="h-64 flex items-center justify-center">
                  <div className="w-full h-full relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-full bg-gray-100 h-px"></div>
                    <div className="absolute left-0 top-0 h-full w-px bg-gray-100"></div>
                    
                    <div className="flex h-full items-end">
                      <div className="h-[65%] w-8 mx-2 bg-amber-300 relative group">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Q1: 65%</div>
                      </div>
                      <div className="h-[68%] w-8 mx-2 bg-amber-400 relative group">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Q2: 68%</div>
                      </div>
                      <div className="h-[72%] w-8 mx-2 bg-amber-500 relative group">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Q3: 72%</div>
                      </div>
                      <div className="h-[76%] w-8 mx-2 bg-amber-600 relative group">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Q4: 76%</div>
                      </div>
                      <div className="h-[82%] w-8 mx-2 bg-green-400 border-2 border-dashed border-green-600 relative group">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white p-1 shadow rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">Цель: 82%</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">Общий уровень соответствия вырос на <span className="text-green-600 font-medium">+11%</span> за последний год</p>
                </div>
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
