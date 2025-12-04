import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import DashboardPage from '@/components/dashboard/DashboardPage';
import MonitoringPage from '@/components/monitoring/MonitoringPage';
import SimulationPage from '@/components/simulation/SimulationPage';
import ProfilePage from '@/components/profile/ProfilePage';
import AuditPage from '@/components/audit/AuditPage';
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
      title: "Добро пожаловать в RiskAI",
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
        return <AuditPage />;
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
