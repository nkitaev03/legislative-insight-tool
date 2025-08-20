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
import { Progress } from '@/components/ui/progress';
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
  Edit,
  Plus,
  ArrowLeft,
  X
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="sm">
                <X className="w-4 h-4" />
              </Button>
            </DialogClose>
          </div>
          
          <div className="space-y-3">
            {/* Статусы */}
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">Риск</Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Активный</Badge>
            </div>
            
            {/* Название риска */}
            <DialogTitle className="text-2xl font-semibold leading-tight">
              {item.title}
            </DialogTitle>
            
            {/* Категория риска */}
            <p className="text-sm text-muted-foreground">
              Правовой риск
            </p>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          {/* Основной контент с табами */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="assessment" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="assessment">Оценка риска</TabsTrigger>
                <TabsTrigger value="factors">Риск-факторы</TabsTrigger>
                <TabsTrigger value="measures">Меры</TabsTrigger>
              </TabsList>
              
              <TabsContent value="assessment" className="space-y-6 mt-6">
                {/* Уровень риска */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Уровень риска</h3>
                      <Badge variant="destructive" className="text-sm">Очень высокий</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      {/* Вероятность риска */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Вероятность риска</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <Progress value={85} indicatorColor="success" className="h-2" />
                      </div>
                      
                      {/* Влияние на компанию */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Влияние на компанию</span>
                          <span className="font-medium">75%</span>
                        </div>
                        <Progress value={75} indicatorColor="warning" className="h-2" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      {/* Вероятные потери */}
                      <div>
                        <span className="text-sm text-muted-foreground">Вероятные потери</span>
                        <p className="text-lg font-semibold text-red-600">
                          {item.financialImpact ? formatCurrency(item.financialImpact.expected) : '5 000 000 ₽'}
                        </p>
                      </div>
                      
                      {/* Стратегия реагирования */}
                      <div>
                        <span className="text-sm text-muted-foreground">Стратегия реагирования</span>
                        <p className="text-lg font-semibold">Снижение</p>
                      </div>
                    </div>
                  </div>
                </Card>
                
                {/* Описание */}
                <Card className="p-6">
                  <h4 className="text-base font-semibold mb-3">Описание риска</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </TabsContent>
              
              <TabsContent value="factors" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Риск-факторы</h3>
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Данные не предоставлены</p>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="measures" className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Меры по управлению риском</h3>
                  
                  <div className="space-y-3">
                    {/* Мера 1 */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">MSR-001</span>
                        <span className="text-sm font-medium">Назначить ответственного за обработку персональных данных</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Новая</Badge>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Мера 2 */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">MSR-002</span>
                        <span className="text-sm font-medium">Провести обучение сотрудников</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Реализована</Badge>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Мера 3 */}
                    <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-muted-foreground">MSR-003</span>
                        <span className="text-sm font-medium">Аудит процессов хранения и обработки персональных данных</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">Новая</Badge>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Правая колонка */}
          <div className="space-y-4">
            {/* Кнопка Редактировать */}
            <Button variant="ghost" className="w-full justify-start">
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            
            {/* Карточка Информация */}
            <Card className="p-5">
              <h4 className="font-semibold mb-4">Информация</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Риск</span>
                  <a href="#" className="text-compBlue-600 hover:text-compBlue-700 font-medium">
                    RSK-382
                  </a>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Дата создания</span>
                  <span className="font-medium">04.07.2025</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Автор карточки</span>
                  <Badge variant="secondary" className="bg-compBlue-100 text-compBlue-700">
                    <FileText className="w-3 h-3 mr-1" />
                    NORM AI
                  </Badge>
                </div>
              </div>
            </Card>
            
            {/* Владелец риска */}
            <Card className="p-5">
              <h4 className="font-semibold mb-3">Владелец риска</h4>
              <p className="text-sm font-medium">ООО «Сбербанк-сервис»</p>
            </Card>
            
            {/* Кнопка Добавить меру */}
            <Button className="w-full justify-center">
              <span>Добавить меру</span>
              <Plus className="w-4 h-4 ml-2" />
            </Button>
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