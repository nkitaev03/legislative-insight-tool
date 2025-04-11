
import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuditService from './AuditService';

export default function AuditPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Marketing audit
  const marketingAudit = {
    serviceName: "Маркетинг",
    type: "marketing" as const,
    performedBy: "Иванова А.С., маркетинговый аналитик",
    performedDate: "15.03.2025",
    score: 78,
    summary: "Маркетинговая деятельность компании в целом показывает хорошие результаты. Имеются области, требующие внимания: стратегия продвижения в социальных сетях и маркетинговые материалы для новой продуктовой линейки.",
    findings: [
      {
        id: "m1",
        title: "Отсутствие четкого маркетингового плана",
        description: "В компании отсутствует формализованный маркетинговый план с четким определением целевой аудитории, каналов продвижения и бюджета по направлениям.",
        severity: "medium" as const,
        recommendations: [
          "Разработать детальный маркетинговый план с чёткими KPI",
          "Определить целевые аудитории для каждого продукта"
        ],
        impact: "Снижение эффективности маркетинговых кампаний, распыление бюджета"
      },
      {
        id: "m2",
        title: "Недостаточное присутствие в новых социальных сетях",
        description: "Компания недостаточно представлена в активно растущих социальных сетях, что ограничивает охват потенциальной аудитории.",
        severity: "low" as const,
        recommendations: [
          "Расширить присутствие в новых социальных платформах",
          "Разработать стратегию контента для разных платформ"
        ]
      }
    ],
    recommendations: [
      "Разработать и внедрить маркетинговый план на следующие 12 месяцев с чёткими KPI",
      "Увеличить активность в социальных сетях и расширить присутствие на новых платформах",
      "Провести исследование потребностей клиентов для лучшего понимания целевой аудитории",
      "Обновить маркетинговые материалы с учетом новой продуктовой линейки"
    ],
    nextAuditDue: "15.03.2026"
  };

  // Sales audit
  const salesAudit = {
    serviceName: "Продажи",
    type: "sales" as const,
    performedBy: "Петров И.Н., бизнес-аналитик",
    performedDate: "20.03.2025",
    score: 85,
    summary: "Процессы продаж в компании хорошо организованы и эффективны. CRM система используется корректно, что обеспечивает высокую конверсию. Есть потенциал для улучшения кросс-продаж и послепродажного обслуживания.",
    findings: [
      {
        id: "s1",
        title: "Недостаточный уровень кросс-продаж",
        description: "Низкий показатель кросс-продаж среди существующих клиентов, особенно в секторе малого бизнеса.",
        severity: "medium" as const,
        recommendations: [
          "Разработать стратегию кросс-продаж для каждого сегмента клиентов",
          "Обучить отдел продаж технике кросс-продаж"
        ]
      }
    ],
    recommendations: [
      "Внедрить программу стимулирования кросс-продаж",
      "Улучшить процесс послепродажного обслуживания",
      "Разработать более детальную сегментацию клиентов для персонализированных предложений"
    ],
    nextAuditDue: "20.03.2026"
  };

  // Finance audit
  const financeAudit = {
    serviceName: "Финансы",
    type: "finance" as const,
    performedBy: "Сидоров П.М., финансовый аналитик",
    performedDate: "25.03.2025",
    score: 92,
    summary: "Финансовое состояние компании стабильное, отчетность ведется корректно. Отмечается высокая эффективность управления оборотным капиталом и ликвидностью. Рекомендуется внедрить более детальный анализ рентабельности по продуктам.",
    findings: [
      {
        id: "f1",
        title: "Отсутствие детального анализа рентабельности по продуктам",
        description: "Текущая система учета не позволяет с достаточной детализацией отслеживать рентабельность отдельных продуктов и услуг.",
        severity: "low" as const,
        recommendations: [
          "Внедрить систему учета затрат по продуктам",
          "Разработать методику расчета рентабельности для каждой продуктовой линейки"
        ]
      }
    ],
    recommendations: [
      "Внедрить систему детального анализа рентабельности по продуктам и услугам",
      "Оптимизировать процесс бюджетирования через внедрение скользящего прогноза",
      "Разработать более детальные KPI для финансового департамента"
    ],
    nextAuditDue: "25.03.2026"
  };

  // Business process audit
  const processAudit = {
    serviceName: "Бизнес-процессы",
    type: "process" as const,
    performedBy: "Козлова М.В., бизнес-консультант",
    performedDate: "30.03.2025",
    score: 65,
    summary: "Основные бизнес-процессы компании структурированы, но недостаточно формализованы и документированы. Выявлены возможности для оптимизации в области управления проектами и документооборота.",
    findings: [
      {
        id: "p1",
        title: "Недостаточная формализация ключевых бизнес-процессов",
        description: "Многие ключевые бизнес-процессы не имеют формальной документации и стандартизации, что приводит к вариативности выполнения и снижению эффективности.",
        severity: "high" as const,
        recommendations: [
          "Разработать и документировать стандарты ключевых бизнес-процессов",
          "Внедрить систему контроля качества процессов"
        ],
        impact: "Снижение эффективности, повышение рисков ошибок и зависимость от ключевого персонала"
      },
      {
        id: "p2",
        title: "Неэффективный документооборот",
        description: "Система документооборота требует модернизации, наблюдается дублирование документов и отсутствие единого стандарта оформления.",
        severity: "medium" as const,
        recommendations: [
          "Внедрить электронную систему документооборота",
          "Стандартизировать шаблоны документов"
        ]
      },
      {
        id: "p3",
        title: "Отсутствие системы управления знаниями",
        description: "В компании нет формализованной системы управления знаниями, что затрудняет передачу опыта и обучение новых сотрудников.",
        severity: "medium" as const,
        recommendations: [
          "Создать базу знаний компании",
          "Внедрить практику регулярного обмена опытом"
        ]
      }
    ],
    recommendations: [
      "Формализовать и документировать ключевые бизнес-процессы компании",
      "Внедрить современную систему электронного документооборота",
      "Создать базу знаний и систему управления знаниями",
      "Оптимизировать процесс управления проектами через внедрение гибких методологий"
    ],
    nextAuditDue: "30.03.2026"
  };

  // Filter audits based on search and filter criteria
  const audits = [marketingAudit, salesAudit, financeAudit, processAudit];
  
  const filteredAudits = audits.filter(audit => {
    // Filter by search query
    if (searchQuery && !audit.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !audit.summary.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by type
    if (filterType !== 'all' && audit.type !== filterType) {
      return false;
    }
    
    return true;
  });
  
  // Sort audits
  const sortedAudits = [...filteredAudits].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.performedDate.split('.').reverse().join('-')).getTime() - 
             new Date(a.performedDate.split('.').reverse().join('-')).getTime();
    } else if (sortOrder === 'oldest') {
      return new Date(a.performedDate.split('.').reverse().join('-')).getTime() - 
             new Date(b.performedDate.split('.').reverse().join('-')).getTime();
    } else if (sortOrder === 'score-high') {
      return b.score - a.score;
    } else if (sortOrder === 'score-low') {
      return a.score - b.score;
    }
    return 0;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Независимый аудит</h1>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          <span>Экспортировать все отчеты</span>
        </Button>
      </div>
      
      <div className="bg-muted/30 p-6 rounded-lg">
        <h2 className="text-lg font-medium mb-3">Независимая оценка ключевых направлений деятельности</h2>
        <p className="text-muted-foreground">
          Этот раздел содержит результаты независимого аудита различных аспектов деятельности компании. 
          Аудит проводится ежегодно для выявления областей для улучшения и оптимизации. 
          Каждый отчет предоставляет детальный анализ и рекомендации для повышения эффективности.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border-4 border-purple-200 flex items-center justify-center relative">
              <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                {marketingAudit.score}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium">Маркетинг</h3>
              <p className="text-xs text-muted-foreground">Последний аудит: {marketingAudit.performedDate}</p>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border-4 border-blue-200 flex items-center justify-center relative">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {salesAudit.score}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium">Продажи</h3>
              <p className="text-xs text-muted-foreground">Последний аудит: {salesAudit.performedDate}</p>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border-4 border-green-200 flex items-center justify-center relative">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                {financeAudit.score}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium">Финансы</h3>
              <p className="text-xs text-muted-foreground">Последний аудит: {financeAudit.performedDate}</p>
            </div>
          </div>
          
          <div className="bg-white border rounded-lg p-3 flex flex-col items-center justify-center text-center">
            <div className="h-12 w-12 rounded-full border-4 border-orange-200 flex items-center justify-center relative">
              <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                {processAudit.score}
              </div>
            </div>
            <div className="mt-2">
              <h3 className="font-medium">Бизнес-процессы</h3>
              <p className="text-xs text-muted-foreground">Последний аудит: {processAudit.performedDate}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Поиск отчетов..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={filterType}
              onValueChange={setFilterType}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Фильтровать по типу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все отчеты</SelectItem>
                <SelectItem value="marketing">Маркетинг</SelectItem>
                <SelectItem value="sales">Продажи</SelectItem>
                <SelectItem value="finance">Финансы</SelectItem>
                <SelectItem value="process">Бизнес-процессы</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
            <Select 
              value={sortOrder}
              onValueChange={setSortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Сортировать по" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Сначала новые</SelectItem>
                <SelectItem value="oldest">Сначала старые</SelectItem>
                <SelectItem value="score-high">По оценке (выс-низ)</SelectItem>
                <SelectItem value="score-low">По оценке (низ-выс)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {sortedAudits.map((audit) => (
          <AuditService 
            key={audit.type}
            serviceName={audit.serviceName}
            type={audit.type}
            performedBy={audit.performedBy}
            performedDate={audit.performedDate}
            score={audit.score}
            summary={audit.summary}
            findings={audit.findings}
            recommendations={audit.recommendations}
            nextAuditDue={audit.nextAuditDue}
          />
        ))}
        
        {sortedAudits.length === 0 && (
          <div className="p-8 text-center text-muted-foreground bg-muted/30 rounded-lg">
            <p>Нет отчетов, соответствующих критериям поиска</p>
          </div>
        )}
      </div>
    </div>
  );
}
