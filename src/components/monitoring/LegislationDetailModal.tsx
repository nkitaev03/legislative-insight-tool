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
          <div className="flex items-center gap-3">
            <div className="p-2 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
              <Scale className="w-5 h-5 text-compBlue-600" />
            </div>
            <span className="text-sm font-medium text-compBlue-600">Законодательство</span>
          </div>
          
          <DialogTitle className="text-xl font-semibold leading-tight pr-8">
            {item.title}
          </DialogTitle>
          
          <p className="text-sm text-muted-foreground">
            {item.description}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Что случилось */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-compBlue-600" />
                Что случилось
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </Card>

            {/* Как это влияет */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-compOrange-600" />
                Как это влияет
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.strategicImpact || ''}
              </p>
              
              {item.financialImpact && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Финансовое влияние:</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Минимум:</span>
                      <p className="font-semibold">{formatCurrency(item.financialImpact.min)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Ожидаемое:</span>
                      <p className="font-semibold">{formatCurrency(item.financialImpact.expected)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Максимум:</span>
                      <p className="font-semibold">{formatCurrency(item.financialImpact.max)}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Новые риски */}
            {item.risks && item.risks.length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  Новые риски
                </h3>
                <div className="space-y-3">
                  {item.risks.map((risk, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{risk}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">РЗС-17318</span>
                          <span className="text-xs text-muted-foreground">20.02.2024</span>
                          <Badge variant="secondary" className="text-xs">
                            {getRiskLevelText(item.risk)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Что делать */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Что делать</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Давай действовать на опережение! Я уже собрал информацию о новых требованиях.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-medium">Рекомендации к мерам</h4>
                {item.recommendations && item.recommendations.length > 0 ? (
                  <div className="space-y-3">
                    {item.recommendations.map((rec, index) => (
                      <RecommendationItem key={index} recommendation={rec} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <RecommendationItem 
                      recommendation={{
                        text: "Назначить ответственного за обработку персональных данных",
                        responsible: "Не назначен",
                        status: "pending"
                      }}
                    />
                    <RecommendationItem 
                      recommendation={{
                        text: "Провести обучение сотрудников",
                        responsible: "Не назначен", 
                        status: "pending"
                      }}
                    />
                    <RecommendationItem 
                      recommendation={{
                        text: "Аудит процессов хранения и обработки персональных данных",
                        responsible: "Не назначен",
                        status: "pending"
                      }}
                    />
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Боковая панель */}
          <div className="space-y-4">
            {/* Есть вопросы */}
            <Card 
              className="p-4 bg-compGreen-50 dark:bg-compGreen-900/20 border-compGreen-200 cursor-pointer hover:bg-compGreen-100 dark:hover:bg-compGreen-900/30 transition-colors"
              onClick={() => setIsFeedbackModalOpen(true)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-compGreen-500 rounded-full">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-compGreen-700 dark:text-compGreen-300">Есть вопросы?</h4>
                  <p className="text-xs text-compGreen-600 dark:text-compGreen-400">Я отвечу на любой из них</p>
                </div>
              </div>
            </Card>

            {/* Информация */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">Информация</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Опубликовано</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <Separator />
                <div>
                  <span className="text-muted-foreground">Источники</span>
                  <a 
                    href={item.sourceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-compBlue-600 hover:text-compBlue-700 mt-1"
                  >
                    <span className="text-xs">{item.source}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </Card>

            {/* Действия */}
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="flex-1">
                <Star className="w-4 h-4 mr-1" />
                В избранное
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Оценка согласованности */}
            <Card className="p-4 text-center">
              <div className="mb-2">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-sm font-medium text-red-600">Не согласен с оценкой</p>
              </div>
            </Card>
          </div>
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