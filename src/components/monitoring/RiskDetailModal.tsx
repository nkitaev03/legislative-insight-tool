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

        <div className="space-y-6 mt-6">
          {/* Вероятность и влияние */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-compBlue-600" />
                Вероятность риска
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Вероятность</span>
                  <span className="font-medium">{risk.probability}%</span>
                </div>
                <Progress 
                  value={risk.probability} 
                  indicatorColor={getProbabilityColor(risk.probability)}
                />
                <p className="text-xs text-muted-foreground">
                  Оценка основана на анализе исторических данных и текущих условий
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-compOrange-600" />
                Влияние на компанию
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Уровень влияния</span>
                  <Badge 
                    variant={risk.impact === 'high' ? 'destructive' : risk.impact === 'medium' ? 'warning' : 'success'}
                  >
                    {getImpactText(risk.impact)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {risk.description}
                </p>
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
      </DialogContent>
    </Dialog>
  );
}