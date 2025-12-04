import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Link2,
  Clock,
  User,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Measure {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'critical' | 'high' | 'medium' | 'low';
  deadline: string;
  responsible: string;
  progress: number;
  linkedRisk: {
    id: string;
    title: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  };
}

const mockMeasures: Measure[] = [
  {
    id: 'msr-1',
    title: 'Обновить политику конфиденциальности',
    status: 'overdue',
    priority: 'critical',
    deadline: '2024-01-20',
    responsible: 'Иванов И.И.',
    progress: 60,
    linkedRisk: {
      id: 'risk-1',
      title: 'Штрафы за нарушение требований к обработке ПДн',
      severity: 'critical'
    }
  },
  {
    id: 'msr-2',
    title: 'Провести аудит систем хранения ПДн',
    status: 'in_progress',
    priority: 'high',
    deadline: '2024-01-25',
    responsible: 'Петрова А.С.',
    progress: 45,
    linkedRisk: {
      id: 'risk-2',
      title: 'Утечка персональных данных клиентов',
      severity: 'critical'
    }
  },
  {
    id: 'msr-3',
    title: 'Внедрить шифрование данных в транзите',
    status: 'in_progress',
    priority: 'high',
    deadline: '2024-02-01',
    responsible: 'Соколов Д.М.',
    progress: 30,
    linkedRisk: {
      id: 'risk-2',
      title: 'Утечка персональных данных клиентов',
      severity: 'critical'
    }
  },
  {
    id: 'msr-4',
    title: 'Провести проверку санитарных условий',
    status: 'pending',
    priority: 'medium',
    deadline: '2024-01-30',
    responsible: 'Смирнова Е.В.',
    progress: 0,
    linkedRisk: {
      id: 'risk-3',
      title: 'Внеплановая проверка Роспотребнадзора',
      severity: 'high'
    }
  },
  {
    id: 'msr-5',
    title: 'Настроить автоматическое резервное копирование',
    status: 'completed',
    priority: 'medium',
    deadline: '2024-01-15',
    responsible: 'Соколов Д.М.',
    progress: 100,
    linkedRisk: {
      id: 'risk-5',
      title: 'Несоответствие процедур резервного копирования',
      severity: 'medium'
    }
  }
];

const getStatusConfig = (status: Measure['status']) => {
  const config = {
    pending: { label: 'Ожидает', color: 'bg-gray-500/10 text-gray-600 dark:text-gray-400', icon: Circle },
    in_progress: { label: 'В работе', color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', icon: Clock },
    completed: { label: 'Выполнено', color: 'bg-green-500/10 text-green-600 dark:text-green-400', icon: CheckCircle2 },
    overdue: { label: 'Просрочено', color: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: AlertTriangle }
  };
  return config[status];
};

const getPriorityColor = (priority: Measure['priority']) => {
  const colors = {
    critical: 'border-l-red-500',
    high: 'border-l-orange-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  };
  return colors[priority];
};

const getRiskSeverityColor = (severity: Measure['linkedRisk']['severity']) => {
  const colors = {
    critical: 'text-red-500',
    high: 'text-orange-500',
    medium: 'text-yellow-600',
    low: 'text-green-500'
  };
  return colors[severity];
};

export default function MeasuresSection() {
  const [measures, setMeasures] = useState(mockMeasures);

  const toggleComplete = (id: string) => {
    setMeasures(prev => prev.map(m => 
      m.id === id 
        ? { ...m, status: m.status === 'completed' ? 'pending' : 'completed', progress: m.status === 'completed' ? 0 : 100 }
        : m
    ));
  };

  const completedCount = measures.filter(m => m.status === 'completed').length;
  const totalProgress = Math.round(measures.reduce((acc, m) => acc + m.progress, 0) / measures.length);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Меры
          </CardTitle>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            Добавить
          </Button>
        </div>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-muted-foreground">Общий прогресс</span>
              <span className="font-medium">{totalProgress}%</span>
            </div>
            <Progress value={totalProgress} className="h-2" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedCount}/{measures.length} выполнено
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {measures.map((measure) => {
          const statusConfig = getStatusConfig(measure.status);
          const StatusIcon = statusConfig.icon;
          
          return (
            <div
              key={measure.id}
              className={cn(
                "p-3 border rounded-lg border-l-4 transition-all hover:bg-muted/30",
                getPriorityColor(measure.priority),
                measure.status === 'completed' && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={measure.status === 'completed'}
                  onCheckedChange={() => toggleComplete(measure.id)}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className={cn("text-xs", statusConfig.color)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {measure.deadline}
                    </span>
                  </div>
                  <h4 className={cn(
                    "font-medium text-sm leading-tight mb-2",
                    measure.status === 'completed' && "line-through"
                  )}>
                    {measure.title}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link2 className="h-3 w-3" />
                      <AlertTriangle className={cn("h-3 w-3", getRiskSeverityColor(measure.linkedRisk.severity))} />
                      <span className="truncate max-w-[200px]">{measure.linkedRisk.title}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{measure.responsible}</span>
                    </div>
                  </div>
                  
                  {measure.status !== 'completed' && measure.status !== 'pending' && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Прогресс</span>
                        <span>{measure.progress}%</span>
                      </div>
                      <Progress value={measure.progress} className="h-1.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
