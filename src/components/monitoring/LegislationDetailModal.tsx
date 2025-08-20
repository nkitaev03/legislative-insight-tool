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
  
  if (!item) return null;

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
        <DialogHeader className="space-y-4">
          {/* Статусы */}
          <div className="flex gap-2">
            <Badge variant="destructive" className="text-xs">Риск</Badge>
            <Badge variant="outline" className="text-xs border-compGreen-500 text-compGreen-600">Активный</Badge>
          </div>
          
          <DialogTitle className="text-xl font-semibold leading-tight pr-8">
            <div className="space-y-1">
              <div>{item.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                Правовой риск
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Уровень риска */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Уровень риска</h3>
              <Badge variant="destructive" className="bg-red-600">Очень высокий</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Вероятность риска */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Вероятность риска</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              {/* Влияние на компанию */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Влияние на компанию</span>
                  <span className="font-medium">92%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>

              {/* Вероятные потери */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Вероятные потери</span>
                  <span className="font-medium">{item.financialImpact ? formatCurrency(item.financialImpact.expected) : 'Не указано'}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-compOrange-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              {/* Стратегия реагирования */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Стратегия реагирования</span>
                  <span className="font-medium">Снижение</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-compBlue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </Card>

          {/* Риск-факторы */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-compOrange-600" />
              Риск-факторы
            </h3>
            <div className="text-center py-8 text-muted-foreground">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6" />
              </div>
              <p>Данные не предоставлены</p>
            </div>
          </Card>

          {/* Владелец риска */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Владелец риска</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
                <Building className="w-5 h-5 text-compBlue-600" />
              </div>
              <div>
                <p className="font-medium">ООО «Сбербанк-сервис»</p>
                <p className="text-sm text-muted-foreground">Владелец риска</p>
              </div>
            </div>

            {/* Блок информации */}
            <div className="p-4 bg-muted/30 rounded-lg space-y-3">
              <h4 className="font-medium text-sm">Информация</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">ID риска:</span>
                  <p className="font-medium">{item.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Дата создания:</span>
                  <p className="font-medium">{formatDate(item.date)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Автор карточки:</span>
                  <p className="font-medium">NORM AI</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Добавить меру */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Меры</h3>
                <p className="text-sm text-muted-foreground">Управление мерами по снижению риска</p>
              </div>
              <Button className="bg-compBlue-500 hover:bg-compBlue-600">
                Добавить меру
              </Button>
            </div>
            
            <div className="mt-4 p-4 border-2 border-dashed border-muted rounded-lg text-center">
              <p className="text-muted-foreground">Нет добавленных мер</p>
              <p className="text-xs text-muted-foreground mt-1">
                Создайте новую меру или выберите существующую
              </p>
            </div>
          </Card>
        </div>
        
        <FeedbackModal 
          isOpen={isFeedbackModalOpen}
          onClose={() => setIsFeedbackModalOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function RecommendationItem({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
      <div className="p-2 bg-compBlue-100 dark:bg-compBlue-900/30 rounded-lg">
        <FileText className="w-4 h-4 text-compBlue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{recommendation.text}</p>
        <p className="text-xs text-muted-foreground mt-1">
          Ответственный: {recommendation.responsible}
        </p>
      </div>
      <div className="flex gap-2">
        <Button size="sm" className="bg-compGreen-500 hover:bg-compGreen-600 text-white">
          Делать
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}