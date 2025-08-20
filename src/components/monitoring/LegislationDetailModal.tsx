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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Trash2,
  Plus,
  User
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
          <DialogTitle className="text-xl font-semibold leading-tight pr-8">
            <div className="space-y-2">
              <div>{item.title}</div>
              <div className="text-sm text-muted-foreground font-normal">
                № {item.id} от {formatDate(item.date)}
              </div>
              <div className="text-xs text-muted-foreground">
                {item.source}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className="text-xs">
                  {item.category}
                </Badge>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Основной контент с табами */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="risk-assessment" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="risk-assessment">Оценка риска</TabsTrigger>
                <TabsTrigger value="risk-factors">Риск-факторы</TabsTrigger>
                <TabsTrigger value="measures">Меры</TabsTrigger>
              </TabsList>
              
              <TabsContent value="risk-assessment" className="space-y-6 mt-6">
                {/* Уровень риска */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Уровень риска</h3>
                    <Badge 
                      variant={item.risk === 'high' ? 'destructive' : item.risk === 'medium' ? 'default' : 'secondary'}
                      className="text-sm"
                    >
                      {getRiskLevelText(item.risk)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Вероятность риска */}
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Вероятность риска</div>
                      <div className="flex items-center gap-2">
                        <div 
                          className={`w-3 h-3 rounded-full ${
                            item.risk === 'low' ? 'bg-green-500' : 
                            item.risk === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              item.risk === 'low' ? 'bg-green-500 w-1/4' : 
                              item.risk === 'medium' ? 'bg-yellow-500 w-2/4' : 'bg-red-500 w-3/4'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Влияние на компанию */}
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Влияние на компанию</div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="h-2 bg-yellow-500 rounded-full w-2/4" />
                        </div>
                      </div>
                    </div>

                    {/* Вероятные потери */}
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Вероятные потери</div>
                      <div className="font-semibold text-lg">
                        {item.financialImpact ? formatCurrency(item.financialImpact.expected) : '0 ₽'}
                      </div>
                    </div>

                    {/* Стратегия реагирования */}
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">Стратегия реагирования</div>
                      <Badge variant="outline" className="text-sm">
                        {item.strategicImpact || 'Снижение'}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Описание */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Описание</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="risk-factors" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Риск-факторы</h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Это причины, которые могут привести к реализации риска.
                  </p>
                  
                  <div className="space-y-4">
                    {item.risks && item.risks.length > 0 ? (
                      item.risks.map((risk, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="font-medium">{risk}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">Нарушение требований законодательства</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Владелец риска */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Владелец риска</h3>
                  <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg">
                    <div className="p-2 bg-compBlue-100 dark:bg-compBlue-900/30 rounded-lg">
                      <User className="w-5 h-5 text-compBlue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{item.responsible || 'ООО "Сбербанк-Сервис"'}</p>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="measures" className="space-y-6 mt-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Меры</h3>
                    <Button size="sm" className="bg-compBlue-600 hover:bg-compBlue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить меру
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {item.recommendations && item.recommendations.length > 0 ? (
                      item.recommendations.map((recommendation, index) => (
                        <MeasureItem key={index} recommendation={recommendation} />
                      ))
                    ) : (
                      <>
                        <MeasureItem 
                          recommendation={{
                            text: "Назначить ответственного за обработку персональных данных",
                            responsible: "Не назначен",
                            status: "pending"
                          }}
                        />
                        <MeasureItem 
                          recommendation={{
                            text: "Провести обучение сотрудников по обработке персональных данных",
                            responsible: "Не назначен",
                            status: "pending"
                          }}
                        />
                        <MeasureItem 
                          recommendation={{
                            text: "Аудит процессов хранения и обработки данных",
                            responsible: "Не назначен",
                            status: "pending"
                          }}
                        />
                      </>
                    )}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Боковая панель */}
          <div className="space-y-4">
            {/* Информация */}
            <Card className="p-4">
              <h4 className="font-medium mb-4">Информация</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Риск</span>
                  <span className="font-medium">{item.id}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Дата создания</span>
                  <span>{formatDate(item.date)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Автор карточки</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-compBlue-600 flex items-center justify-center">
                      <span className="text-xs text-white font-medium">N</span>
                    </div>
                    <span>NORM AI</span>
                  </div>
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
              
              <div className="mt-4 pt-4 border-t">
                <Button size="sm" className="w-full bg-compGreen-600 hover:bg-compGreen-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить меру
                </Button>
              </div>
            </Card>

            {/* Есть вопросы */}
            <Card 
              className="p-4 bg-compGreen-50 dark:bg-compGreen-900/20 border-compGreen-200"
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

function MeasureItem({ recommendation }: { recommendation: Recommendation }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
      <div className="p-2 bg-compBlue-100 dark:bg-compBlue-900/30 rounded-lg">
        <FileText className="w-4 h-4 text-compBlue-600" />
      </div>
      <div className="flex-1">
        <p className="font-medium">{recommendation.text}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Ответственный: {recommendation.responsible}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            Реализация
          </Badge>
          <span className="text-xs text-muted-foreground">Фактическая дата: 12.12.2024</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="default">
          Реализация
        </Button>
        <Button size="sm" variant="outline">
          Новая
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
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