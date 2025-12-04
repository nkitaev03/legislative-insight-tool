import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  FileText,
  Building2,
  ExternalLink,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Event {
  id: string;
  title: string;
  date: string;
  type: 'legislation' | 'news' | 'internal' | 'audit';
  source: string;
  description: string;
  riskCount: number;
  severity: 'high' | 'medium' | 'low';
}

const mockEvents: Event[] = [
  {
    id: 'evt-1',
    title: 'Ужесточение требований к обработке персональных данных',
    date: '2024-01-15',
    type: 'legislation',
    source: 'ФЗ-152 (изменения)',
    description: 'Вступили в силу новые требования к обработке персональных данных. Увеличены штрафы за нарушения до 18 млн рублей.',
    riskCount: 3,
    severity: 'high'
  },
  {
    id: 'evt-2',
    title: 'Закрытие магазина-склада конкурента Роспотребнадзором',
    date: '2024-01-10',
    type: 'news',
    source: 'Новостной мониторинг',
    description: 'Невский районный суд Петербурга закрыл магазин-склад из-за нарушений санитарных требований. Возможен усиленный контроль в отрасли.',
    riskCount: 2,
    severity: 'medium'
  },
  {
    id: 'evt-3',
    title: 'Плановый внутренний аудит информационной безопасности',
    date: '2024-01-08',
    type: 'audit',
    source: 'Внутренний аудит',
    description: 'Выявлены несоответствия в процессах резервного копирования и управления доступами.',
    riskCount: 4,
    severity: 'medium'
  },
  {
    id: 'evt-4',
    title: 'Изменение ставки ЦБ РФ',
    date: '2024-01-05',
    type: 'news',
    source: 'Экономический мониторинг',
    description: 'Центральный банк повысил ключевую ставку на 2%. Это может повлиять на стоимость кредитования.',
    riskCount: 1,
    severity: 'low'
  }
];

const getTypeLabel = (type: Event['type']) => {
  const labels = {
    legislation: 'Законодательство',
    news: 'Новость',
    internal: 'Внутреннее',
    audit: 'Аудит'
  };
  return labels[type];
};

const getTypeColor = (type: Event['type']) => {
  const colors = {
    legislation: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    news: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    internal: 'bg-gray-500/10 text-gray-600 dark:text-gray-400',
    audit: 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
  };
  return colors[type];
};

const getSeverityColor = (severity: Event['severity']) => {
  const colors = {
    high: 'text-red-500',
    medium: 'text-orange-500',
    low: 'text-green-500'
  };
  return colors[severity];
};

export default function EventsSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            События
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className={cn(
              "border rounded-lg transition-all duration-200",
              expandedId === event.id ? "bg-muted/50" : "hover:bg-muted/30"
            )}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleExpand(event.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={cn("text-xs", getTypeColor(event.type))}>
                      {getTypeLabel(event.type)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{event.date}</span>
                  </div>
                  <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <div className={cn("flex items-center gap-1 text-xs", getSeverityColor(event.severity))}>
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span>{event.riskCount}</span>
                  </div>
                  {expandedId === event.id ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            
            {expandedId === event.id && (
              <div className="px-4 pb-4 pt-0 border-t border-border/50">
                <div className="pt-3 space-y-3">
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      Источник: {event.source}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Просмотреть риски ({event.riskCount})
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
