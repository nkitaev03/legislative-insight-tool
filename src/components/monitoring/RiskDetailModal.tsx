import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  User, 
  Shield,
  TrendingUp,
  DollarSign
} from 'lucide-react';

interface RiskData {
  id: string;
  title: string;
  description: string;
  probability: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  factors: string[];
  owner: string;
  measures: string[];
}

interface RiskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  risk: RiskData | null;
}

export default function RiskDetailModal({ 
  isOpen, 
  onClose, 
  risk 
}: RiskDetailModalProps) {
  if (!risk) return null;

  const getImpactColor = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'text-compGreen-600';
      case 'medium': return 'text-compOrange-600';
      case 'high': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getImpactText = (impact: 'low' | 'medium' | 'high') => {
    switch (impact) {
      case 'low': return 'Низкое';
      case 'medium': return 'Среднее';
      case 'high': return 'Высокое';
      default: return 'Неизвестно';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability < 30) return 'success';
    if (probability < 70) return 'warning';
    return 'destructive';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <span className="text-sm font-medium text-red-600">Риск</span>
          </div>
          
          <DialogTitle className="text-xl font-semibold leading-tight pr-8">
            {risk.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            {/* Уровень риска */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-medium text-muted-foreground">Уровень риска</span>
              <Badge variant="success" className="text-base px-4 py-2">
                Низкий
              </Badge>
            </div>

            {/* Виджеты риска */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Вероятность риска
                </h3>
                <div className="space-y-3">
                  <Progress 
                    value={25} 
                    indicatorColor="success"
                    className="h-2"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Влияние на компанию
                </h3>
                <div className="space-y-3">
                  <Progress 
                    value={45} 
                    indicatorColor="warning"
                    className="h-2"
                  />
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Вероятные потери
                </h3>
                <div className="text-2xl font-bold">
                  416 ₽
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Стратегия реагирования
                </h3>
                <div className="text-base font-medium">
                  Снижение
                </div>
              </Card>
            </div>

            {/* Риск факторы */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Риск факторы
              </h3>
              <div className="space-y-3">
                {risk.factors.map((factor, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">{factor}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Владелец риска */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-compBlue-600" />
                Владелец риска
              </h3>
              <div className="flex items-center gap-3 p-3 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
                <div className="p-2 bg-compBlue-500 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">{risk.owner}</p>
                  <p className="text-xs text-muted-foreground">Ответственный за управление риском</p>
                </div>
              </div>
            </Card>

            {/* Меры */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-compGreen-600" />
                Меры
              </h3>
              <div className="space-y-3">
                {risk.measures.map((measure, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-compGreen-50 dark:bg-compGreen-900/20 rounded-lg border border-compGreen-200 dark:border-compGreen-800">
                    <div className="p-1 bg-compGreen-500 rounded-full flex-shrink-0 mt-1">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                    <p className="text-sm">{measure}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-4">
            {/* Информация */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Информация</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата выявления риска</span>
                  <span>15.01.2024</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата последнего обновления</span>
                  <span>20.01.2024</span>
                </div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Статус</span>
                  <Badge variant="warning" className="text-xs">
                    Активный
                  </Badge>
                </div>
                <div className="border-t border-border my-2" />
                <div>
                  <span className="text-muted-foreground">Категория</span>
                  <p className="text-sm mt-1">Информационная безопасность</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}