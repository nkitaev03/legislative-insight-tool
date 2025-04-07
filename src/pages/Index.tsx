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
import RiskAnalysisCard from '@/components/common/RiskAnalysisCard';

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

  // Sample audit data
  const auditData = {
    marketing: {
      title: "Маркетинг",
      score: 85,
      scoreLabel: "Хорошее соответствие",
      description: "Маркетинговые материалы и практики соответствуют большинству нормативных требований, но есть несколько областей для улучшения.",
      risks: [
        {
          id: "mr1",
          title: "Устаревшие правила размещения рекламы",
          description: "Текущие рекламные материалы не учитывают последние изменения в законодательстве о рекламе и маркетинге.",
          impact: "medium" as const,
          category: "Правовой",
          mitigation: "Пересмотреть и обновить правила размещения рекламы в соответствии с новыми требованиями законодательства."
        },
        {
          id: "mr2",
          title: "Отсутствие процедуры согласования рекламных материалов",
          description: "В компании нет формализованной процедуры юридической проверки рекламных материалов перед публикацией.",
          impact: "medium" as const,
          category: "Процессный",
          mitigation: "Внедрить процедуру согласования рекламных материалов с юридическим отделом."
        }
      ],
      actions: [
        {
          id: "ma1",
          title: "Обновить правила размещения рекламы",
          description: "Пересмотреть и актуализировать внутренние правила размещения рекламы с учетом последних изменениями в законодательстве.",
          status: "in-progress" as const,
          dueDate: "15.05.2025",
          assignedTo: "Отдел маркетинга"
        },
        {
          id: "ma2",
          title: "Разработать процедуру согласования",
          description: "Создать и внедрить процедуру обязательного согласования рекламных материалов с юридическим отделом.",
          status: "pending" as const,
          dueDate: "01.06.2025",
          assignedTo: "Юридический отдел"
        }
      ]
    },
    sales: {
      title: "Продажи",
      score: 92,
      scoreLabel: "Отличное соответствие",
      description: "Процессы продаж хорошо документированы и соответствуют нормативным требованиям. Персонал хорошо обучен.",
      risks: [
        {
          id: "sr1",
          title: "Неполная документация по некоторым сделкам",
          description: "Для небольшого процента сделок документация ведется не полностью, что может создать риски при проверках.",
          impact: "low" as const,
          category: "Документационный",
          mitigation: "Внедрить систему контроля за полнотой документирования всех сделок."
        }
      ],
      actions: [
        {
          id: "sa1",
          title: "Улучшить систему документирования сделок",
          description: "Внедрить автоматизированную систему контроля за полнотой документирования всех сделок.",
          status: "completed" as const,
          dueDate: "01.04.2025",
          assignedTo: "Отдел продаж"
        }
      ]
    },
    finance: {
      title: "Финансы",
      score: 68,
      scoreLabel: "Требует внимания",
      description: "Финансовые процессы и отчетность в целом соответствуют требованиям, но есть несколько существенных областей, требующих улучшения.",
      risks: [
        {
          id: "fr1",
          title: "Неактуальная учетная политика",
          description: "Учетная политика не обновлялась более двух лет и не учитывает последние изменения в МСФО.",
          impact: "medium" as const,
          category: "Финансовый",
          mitigation: "Обновить учетную политику в соответствии с последними изменениями в МСФО."
        },
        {
          id: "fr2",
          title: "Отсутствие автоматизации финансовых процессов",
          description: "Многие финансовые процессы выполняются вручную, что увеличивает риск ошибок и задержек.",
          impact: "medium" as const,
          category: "Операционный",
          mitigation: "Внедрить автоматизированную систему финансового учета и отчетности."
        },
        {
          id: "fr3",
          title: "Нарушения в сроках подачи отчетности",
          description: "За последний год были случаи нарушения сроков подачи налоговой отчетности.",
          impact: "high" as const,
          category: "Регуляторный",
          mitigation: "Разработать систему контроля сроков подачи отчетности и назначить ответственных."
        }
      ],
      actions: [
        {
          id: "fa1",
          title: "Обновить учетную политику",
          description: "Пересмотреть и актуализировать учетную политику в соответствии с последними изменениями в МСФО.",
          status: "pending" as const,
          dueDate: "01.07.2025",
          assignedTo: "Финансовый директор"
        },
        {
          id: "fa2",
          title: "Внедрить автоматизированную систему",
          description: "Внедрить современную автоматизированную систему финансового учета и отчетности.",
          status: "in-progress" as const,
          dueDate: "31.12.2025",
          assignedTo: "ИТ-отдел"
        },
        {
          id: "fa3",
          title: "Разработать систему контроля сроков",
          description: "Создать систему мониторинга и контроля сроков подачи отчетности с назначением ответственных лиц.",
          status: "pending" as const,
          dueDate: "15.07.2025",
          assignedTo: "Главный бухгалтер"
        }
      ]
    },
    processes: {
      title: "Бизнес-процессы",
      score: 58,
      scoreLabel: "Требует улучшения",
      description: "Бизнес-процессы компании недостаточно формализованы и документированы, что создает существенные риски для соответствия нормативным требованиям.",
      risks: [
        {
          id: "pr1",
          title: "Отсутствие системы управления документацией",
          description: "В компании нет единой системы управления документацией, что затрудняет контроль версий и актуальности документов.",
          impact: "high" as const,
          category: "Процессный",
          mitigation: "Внедрить единую систему управления документацией."
        },
        {
          id: "pr2",
          title: "Отсутствие формализованных процессов закупок",
          description: "Процессы выбора поставщиков и проведения закупок не формализованы, что создает риски нерационального использования ресурсов.",
          impact: "high" as const,
          category: "Операционный",
          mitigation: "Разработать и внедрить формализованные процессы закупок и выбора поставщиков."
        },
        {
          id: "pr3",
          title: "Отсутствие политики по управлению конфликтами интересов",
          description: "В компании отсутствует политика по выявлению и управлению конфликтами интересов.",
          impact: "high" as const,
          category: "Этический",
          mitigation: "Разработать и внедрить политику по управлению конфликтами интересов."
        },
        {
          id: "pr4",
          title: "Неэффективные процессы внутреннего контроля",
          description: "Система внутреннего контроля не обеспечивает своевременное выявление и устранение нарушений.",
          impact: "medium" as const,
          category: "Контрольный",
          mitigation: "Усовершенствовать систему внутреннего контроля."
        }
      ],
      actions: [
        {
          id: "pa1",
          title: "Внедрить систему управления документацией",
          description: "Внедрить современную систему управления документацией с контролем версий и автоматическим отслеживанием изменений.",
          status: "pending" as const,
          dueDate: "01.09.2025",
          assignedTo: "ИТ-отдел"
        },
        {
          id: "pa2",
          title: "Разработать процессы закупок",
          description: "Создать и утвердить формализованные процессы проведения закупок и выбора поставщиков.",
          status: "in-progress" as const,
          dueDate: "15.08.2025",
          assignedTo: "Отдел закупок"
        },
        {
          id: "pa3",
          title: "Разработать политику по конфликтам интересов",
          description: "Разработать и внедрить политику по выявлению и управлению конфликтами интересов.",
          status: "pending" as const,
          dueDate: "01.10.2025",
          assignedTo: "Юридический отдел"
        },
        {
          id: "pa4",
          title: "Усовершенствовать систему внутреннего контроля",
          description: "Провести аудит и усовершенствовать систему внутреннего контроля для более эффективного выявления нарушений.",
          status: "pending" as const,
          dueDate: "31.12.2025",
          assignedTo: "Отдел внутреннего контроля"
        }
      ]
    }
  };

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
          <div className="p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Аудит соответствия нормативным требованиям</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <RiskAnalysisCard 
                title={auditData.marketing.title}
                score={auditData.marketing.score}
                scoreLabel={auditData.marketing.scoreLabel}
                description={auditData.marketing.description}
                risks={auditData.marketing.risks}
                actions={auditData.marketing.actions}
              />
              
              <RiskAnalysisCard 
                title={auditData.sales.title}
                score={auditData.sales.score}
                scoreLabel={auditData.sales.scoreLabel}
                description={auditData.sales.description}
                risks={auditData.sales.risks}
                actions={auditData.sales.actions}
              />
              
              <RiskAnalysisCard 
                title={auditData.finance.title}
                score={auditData.finance.score}
                scoreLabel={auditData.finance.scoreLabel}
                description={auditData.finance.description}
                risks={auditData.finance.risks}
                actions={auditData.finance.actions}
              />
              
              <RiskAnalysisCard 
                title={auditData.processes.title}
                score={auditData.processes.score}
                scoreLabel={auditData.processes.scoreLabel}
                description={auditData.processes.description}
                risks={auditData.processes.risks}
                actions={auditData.processes.actions}
              />
            </div>
            
            <div className="bg-mesh-gradient rounded-lg p-8 text-center shadow-md mb-8">
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
                  Скачать подробный отчет
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
