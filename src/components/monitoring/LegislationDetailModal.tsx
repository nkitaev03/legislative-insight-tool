import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogClose 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Scale, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  MessageCircle,
  Calendar,
  Building,
  ExternalLink,
  Star,
  Share2,
  Trash2
} from 'lucide-react';
import RiskIndicator from '@/components/common/RiskIndicator';
import { LegislationItem, Recommendation } from './types';
import FeedbackModal from './FeedbackModal';
import RiskDetailModal from './RiskDetailModal';
import ForwardModal from './ForwardModal';

interface LegislationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: LegislationItem | null;
}

export default function LegislationDetailModal({ 
  isOpen, 
  onClose, 
  item 
}: LegislationDetailModalProps) {
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<any>(null);
  
  if (!item) return null;

  const handleRiskClick = (riskTitle: string, riskDescription: string) => {
    // Mock risk data - in real app this would come from props or API
    const riskData = {
      id: '1',
      title: riskTitle,
      description: riskDescription,
      probability: 75,
      impact: 'high' as const,
      factors: [
        'Недостаточная осведомленность сотрудников о новых требованиях',
        'Отсутствие технических средств защиты информации',
        'Неактуальная документация по обработке персональных данных',
        'Отсутствие регулярного аудита систем защиты'
      ],
      owner: 'Иванов И.И., Руководитель отдела ИБ',
      measures: [
        'Провести обучение всех сотрудников новым требованиям по защите ПДн',
        'Внедрить технические средства защиты информации (антивирус, файрвол)',
        'Обновить все внутренние документы согласно новым требованиям',
        'Назначить ответственного за обработку персональных данных',
        'Провести аудит всех информационных систем на соответствие требованиям'
      ]
    };
    setSelectedRisk(riskData);
    setIsRiskModalOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRiskLevelText = (level: 'low' | 'medium' | 'high') => {
    const levels = {
      low: 'Низкий',
      medium: 'Средний', 
      high: 'Высокий'
    };
    return levels[level];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
              <Scale className="w-5 h-5 text-compBlue-600" />
            </div>
            <span className="text-sm font-medium text-compBlue-600">Законодательство</span>
          </div>
          
          <DialogTitle className="text-xl font-semibold leading-tight">
            {item.title}
          </DialogTitle>
          
          <div className="text-sm text-muted-foreground">
            ООО «Звук»
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Предмет регулирования */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Предмет регулирования</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Как это влияет */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Как это влияет</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Для ООО «Звук» последствия несоблюдения закона № 216-ФЗ заключаются в высоком риске крупных 
                штрафов (до 3 млн руб. за нарушение), потенциальной блокировке сервиса по решению 
                Генпрокуратуры и значительном репутационном ущербе, ведущем к оттоку клиентов. Основные угрозы 
                исходят от несоответствия IT-инфраструктуры требованиям по защите данных (ФЗ-149), отсутствия 
                автоматической модерации контента (ФЗ-126) и риска распространения запрещенного материала (
                ФЗ-436).
              </p>
              
              {/* Risk Items */}
              <div className="space-y-3">
                <div 
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRiskClick('Нарушение требований ФЗ № 149-ФЗ по защите данных в государственных системах', 'RSG-171185 • 20.02.2024')}
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Нарушение требований ФЗ № 149-ФЗ по защите данных в государственных системах</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">RSG-171185 • 20.02.2024</span>
                      <Badge variant="info" className="text-xs">Новый</Badge>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Высокий
                  </Badge>
                  <div className="text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 ml-4">
                  <h4 className="text-sm font-medium">Рекомендации 🔥</h4>
                  <div className="space-y-2">
                    {[
                      "Обновить IT-инфраструктуру в соответствии с Ф3 № 149-ФЗ",
                      "Разработать ВПД по учету рабочего времени и документооборота", 
                      "Провести аудит соответствия системы защиты данных законодательным требованиям"
                    ].map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-1 bg-compBlue-100 dark:bg-compBlue-900/30 rounded">
                          <FileText className="w-3 h-3 text-compBlue-600" />
                        </div>
                        <span className="text-sm flex-1">{rec}</span>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          Снизить риск
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRiskClick('Несоблюдение требований ФЗ № 126-ФЗ по установке технических средств контроля', 'RSG-171185 • 20.02.2024')}
                >
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Несоблюдение требований ФЗ № 126-ФЗ по установке технических средств контроля</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">RSG-171185 • 20.02.2024</span>
                      <Badge variant="info" className="text-xs">Новый</Badge>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    Высокий
                  </Badge>
                  <div className="text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 ml-4">
                  <h4 className="text-sm font-medium">Рекомендации 🔥</h4>
                  <div className="space-y-2">
                    {[
                      "Отсутствие автоматизации процесса модерации контента",
                      "Недостаточная защита данных и контента от утечек"
                    ].map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-1 bg-compBlue-100 dark:bg-compBlue-900/30 rounded">
                          <FileText className="w-3 h-3 text-compBlue-600" />
                        </div>
                        <span className="text-sm flex-1">{rec}</span>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          Снизить риск
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRiskClick('Нарушение норм законодательства о запрещённом контенте (ФЗ № 436-ФЗ)', 'RSG-171185 • 20.02.2024')}
                >
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-full flex-shrink-0">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Нарушение норм законодательства о запрещённом контенте (ФЗ № 436-ФЗ)</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">RSG-171185 • 20.02.2024</span>
                      <Badge variant="info" className="text-xs">Новый</Badge>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-xs">
                    Средний
                  </Badge>
                  <div className="text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <div className="space-y-2 ml-4">
                  <h4 className="text-sm font-medium">Рекомендации 🔥</h4>
                  <div className="space-y-2">
                    {[
                      "Усилить модерацию контента с учетом ФЗ № 436-ФЗ",
                      "Внедрить AI-системы для автоматической фильтрации запрещенного контента",
                      "Обновить внутренние регламенты работы с контентом"
                    ].map((rec, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                        <div className="p-1 bg-compBlue-100 dark:bg-compBlue-900/30 rounded">
                          <FileText className="w-3 h-3 text-compBlue-600" />
                        </div>
                        <span className="text-sm flex-1">{rec}</span>
                        <Button size="sm" variant="outline" className="text-xs h-7 px-2">
                          Снизить риск
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div 
                  className="flex items-center gap-3 p-4 bg-background border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleRiskClick('Отток пользователей в B2C-сегменте', 'RSG-171185 • 20.02.2024')}
                >
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Отток пользователей в B2C-сегменте</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">RSG-171185 • 20.02.2024</span>
                      <span className="text-xs text-green-600">Уровень снижен</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Низкий
                  </Badge>
                  <div className="text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Нормы на связь */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 className="font-medium text-green-700 dark:text-green-300">Норм на связи</h4>
                <div className="text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400">Принимаю вопросы</p>
            </Card>

            {/* Информация */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Информация</h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground block">Опубликован</span>
                  <span className="text-xs">01.02.2024</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">В норме</span>
                  <span className="text-xs">04.02.2024</span>
                </div>
              </div>
            </Card>

            {/* Кем принят */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Кем принят</h4>
              <p className="text-xs text-muted-foreground">
                Государственная Дума Федерального Собрания Российской Федерации
              </p>
              <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs text-compBlue-600">
                <ExternalLink className="w-3 h-3 mr-1" />
                Скачать текст закона
              </Button>
            </Card>

            {/* Влияние на ФЗ */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Влияние на ФЗ</h4>
              <div className="space-y-2 text-xs">
                <div>
                  <a href="#" className="text-compBlue-600 hover:text-compBlue-700 block">
                    ФЗ № 149-ФЗ «Об информации, информационных технологиях и о защите информации»
                  </a>
                </div>
                <div>
                  <a href="#" className="text-compBlue-600 hover:text-compBlue-700 block">
                    ФЗ № 436-ФЗ «О защите детей от информации, причиняющей вред их здоровью и развитию»
                  </a>
                </div>
                <div>
                  <a href="#" className="text-compBlue-600 hover:text-compBlue-700 block">
                    ФЗ № 126-ФЗ «О связи»
                  </a>
                </div>
                <Button variant="ghost" size="sm" className="mt-2 p-0 h-auto text-xs">
                  Ещё 6 ↓
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Модальные окна */}
        <FeedbackModal
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
        
        <RiskDetailModal
          isOpen={isRiskModalOpen}
          onClose={() => setIsRiskModalOpen(false)}
          risk={selectedRisk}
        />
        
        <ForwardModal
          isOpen={isForwardModalOpen}
          onClose={() => setIsForwardModalOpen(false)}
          itemTitle={item.title}
        />
      </DialogContent>
    </Dialog>
  );
}