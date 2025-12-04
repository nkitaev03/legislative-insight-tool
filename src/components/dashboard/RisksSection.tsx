import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Shield, 
  Link2,
  ChevronRight,
  Plus,
  Calendar,
  User,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Risk {
  id: string;
  title: string;
  category: 'financial' | 'legal' | 'operational' | 'technological' | 'reputational';
  severity: 'critical' | 'high' | 'medium' | 'low';
  probability: 'high' | 'medium' | 'low';
  impact: string;
  source: {
    type: 'event' | 'audit' | 'manual' | 'monitoring';
    name: string;
    eventId?: string;
  };
  owner: string;
  createdAt: string;
  measuresCount: number;
}

const mockRisks: Risk[] = [
  {
    id: 'risk-1',
    title: 'Штрафы за нарушение требований к обработке ПДн',
    category: 'legal',
    severity: 'critical',
    probability: 'high',
    impact: 'До 18 млн ₽',
    source: {
      type: 'event',
      name: 'Ужесточение требований к обработке ПДн',
      eventId: 'evt-1'
    },
    owner: 'Петрова А.С.',
    createdAt: '2024-01-15',
    measuresCount: 3
  },
  {
    id: 'risk-2',
    title: 'Утечка персональных данных клиентов',
    category: 'technological',
    severity: 'critical',
    probability: 'medium',
    impact: 'Репутационный ущерб + штрафы',
    source: {
      type: 'event',
      name: 'Ужесточение требований к обработке ПДн',
      eventId: 'evt-1'
    },
    owner: 'Соколов Д.М.',
    createdAt: '2024-01-15',
    measuresCount: 5
  },
  {
    id: 'risk-3',
    title: 'Внеплановая проверка Роспотребнадзора',
    category: 'operational',
    severity: 'high',
    probability: 'medium',
    impact: 'Приостановка деятельности',
    source: {
      type: 'event',
      name: 'Закрытие магазина-склада конкурента',
      eventId: 'evt-2'
    },
    owner: 'Иванов И.И.',
    createdAt: '2024-01-10',
    measuresCount: 2
  },
  {
    id: 'risk-4',
    title: 'Увеличение стоимости кредитного обслуживания',
    category: 'financial',
    severity: 'medium',
    probability: 'high',
    impact: '+15% к расходам на обслуживание',
    source: {
      type: 'monitoring',
      name: 'Экономический мониторинг'
    },
    owner: 'Козлов А.И.',
    createdAt: '2024-01-05',
    measuresCount: 1
  },
  {
    id: 'risk-5',
    title: 'Несоответствие процедур резервного копирования',
    category: 'technological',
    severity: 'medium',
    probability: 'medium',
    impact: 'Потеря данных при сбое',
    source: {
      type: 'audit',
      name: 'Внутренний аудит ИБ'
    },
    owner: 'Соколов Д.М.',
    createdAt: '2024-01-08',
    measuresCount: 2
  }
];

const getCategoryLabel = (category: Risk['category']) => {
  const labels = {
    financial: 'Финансовый',
    legal: 'Юридический',
    operational: 'Операционный',
    technological: 'Технологический',
    reputational: 'Репутационный'
  };
  return labels[category];
};

const getCategoryColor = (category: Risk['category']) => {
  const colors = {
    financial: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    legal: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    operational: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    technological: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
    reputational: 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
  };
  return colors[category];
};

const getSeverityConfig = (severity: Risk['severity']) => {
  const config = {
    critical: { label: 'Критический', color: 'bg-red-500 text-white' },
    high: { label: 'Высокий', color: 'bg-orange-500 text-white' },
    medium: { label: 'Средний', color: 'bg-yellow-500 text-white' },
    low: { label: 'Низкий', color: 'bg-green-500 text-white' }
  };
  return config[severity];
};

const getSourceIcon = (type: Risk['source']['type']) => {
  const icons = {
    event: Calendar,
    audit: Shield,
    manual: User,
    monitoring: TrendingUp
  };
  return icons[type];
};

export default function RisksSection() {
  const [selectedRisk, setSelectedRisk] = useState<string | null>(null);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Риски
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {mockRisks.map((risk) => {
          const severityConfig = getSeverityConfig(risk.severity);
          const SourceIcon = getSourceIcon(risk.source.type);
          
          return (
            <div
              key={risk.id}
              className={cn(
                "p-3 border rounded-lg transition-all cursor-pointer hover:bg-muted/30",
                selectedRisk === risk.id && "ring-2 ring-primary/20 bg-muted/50"
              )}
              onClick={() => setSelectedRisk(selectedRisk === risk.id ? null : risk.id)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge className={cn("text-xs", severityConfig.color)}>
                      {severityConfig.label}
                    </Badge>
                    <Badge variant="secondary" className={cn("text-xs", getCategoryColor(risk.category))}>
                      {getCategoryLabel(risk.category)}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-sm leading-tight mb-2">{risk.title}</h4>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Link2 className="h-3 w-3" />
                    <SourceIcon className="h-3 w-3" />
                    <span>{risk.source.name}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs font-medium text-destructive">{risk.impact}</span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Shield className="h-3 w-3" />
                    <span>{risk.measuresCount} мер</span>
                  </div>
                </div>
              </div>
              
              {selectedRisk === risk.id && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground">Вероятность:</span>
                      <span className="ml-1 font-medium">
                        {risk.probability === 'high' ? 'Высокая' : risk.probability === 'medium' ? 'Средняя' : 'Низкая'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Владелец:</span>
                      <span className="ml-1 font-medium">{risk.owner}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="text-xs h-7">
                      Просмотреть меры ({risk.measuresCount})
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-7">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      Подробнее
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
