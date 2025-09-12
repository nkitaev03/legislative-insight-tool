import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  User, 
  Shield,
  TrendingUp,
  DollarSign,
  ChevronLeft,
  X,
  Plus,
  Eye,
  Trash2,
  MoreHorizontal,
  CheckCircle
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
  const [activeTab, setActiveTab] = useState("assessment");

  if (!risk) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Назад
              </Button>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <DialogTitle className="text-2xl font-semibold mb-2">
            {risk.title}
          </DialogTitle>
          
          <div className="text-sm text-muted-foreground mb-4">
            Риск информационной безопасности
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-fit grid-cols-2">
              <TabsTrigger value="assessment">Оценка риска</TabsTrigger>
              <TabsTrigger value="measures">Меры</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="assessment" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                  
                  {/* Уровень риска */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Уровень риска</h3>
                      <Badge variant="destructive" className="text-sm">
                        Высокий
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">Вероятность</div>
                        <div className="space-y-2">
                          <Progress value={75} className="h-2" />
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">Влияние на компанию</div>
                        <div className="space-y-2">
                          <Progress value={85} className="h-2" />
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">Возможные потери</div>
                        <div className="text-lg font-semibold">3 420 000 ₽</div>
                      </Card>

                      <Card className="p-4">
                        <div className="text-sm text-muted-foreground mb-2">Стратегия реагирования</div>
                        <div className="text-sm font-medium">Снижение</div>
                      </Card>
                    </div>

                    {/* Откуда этот риск */}
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg mb-6">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div className="flex-1">
                        <span className="text-sm font-medium">Откуда этот риск?</span>
                        <span className="text-sm text-muted-foreground ml-2">источники AI анализа</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-compBlue-600">
                        Подробнее →
                      </Button>
                    </div>
                  </div>

                  {/* Лимит на риск */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Лимит на риск</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Прямые потери</div>
                        <div className="text-xl font-semibold">500 000 ₽</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-2">Косвенные потери</div>
                        <div className="text-xl font-semibold">22 196 ₽</div>
                      </div>
                    </div>
                  </div>

                  {/* Риск-факторы */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Риск-факторы</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Это причины, которые могут привести к реализации риска.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Несоответствие IT-инфраструктуры требованиям ФЗ № 149-ФЗ</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                        <div className="w-6 h-6 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <AlertTriangle className="w-4 h-4 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Отсутствие ВНД по учету рабочего времени и документооборота</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Потенциальные последствия */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Потенциальные последствия</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <DollarSign className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Штрафы от 500 тыс. до 3 млн рублей</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <TrendingUp className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Потери выручки при блокировке сервиса</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Shield className="w-4 h-4 text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Юридическая ответственность по ст. 4.101 КоАП РФ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Рекомендации */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Рекомендации</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-compBlue-100 dark:bg-compBlue-900/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-compBlue-600" />
                          </div>
                          <p className="text-sm">Обновить IT-инфраструктуру в соответствии с ФЗ № 149-ФЗ</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                            Делать
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-compBlue-100 dark:bg-compBlue-900/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-compBlue-600" />
                          </div>
                          <p className="text-sm">Разработать ВНД по учету рабочего времени и документооборота</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                            Делать
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-compBlue-100 dark:bg-compBlue-900/30 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Shield className="w-4 h-4 text-compBlue-600" />
                          </div>
                          <p className="text-sm">Провести аудит соответствия системы защиты данных законодательным требованиям</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700 text-white">
                            Делать
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Информация</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Риск</span>
                        <span>RSK-41242001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Создан</span>
                        <span>20 февраля 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Обновлен</span>
                        <span>20 февраля 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Автор</span>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full overflow-hidden">
                            <img 
                              src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                              alt="AI Assistant" 
                              className="w-full h-full"
                            />
                          </div>
                          <span>NORM AI</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">Добавить меру</h4>
                      <Button size="sm" variant="ghost">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="measures" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Меры</h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: "Обновить IT-инфраструктуру в соответствии с ФЗ № 149-ФЗ",
                          code: "МЕР-171185",
                          date: "Плановая дата: 05.03.2024",
                          status: "Новая"
                        },
                        {
                          title: "Обновление политики парольной защиты",
                          code: "МЕР-171185",
                          date: "Фактическая дата: 15.03.2024",
                          status: "Реализована"
                        },
                        {
                          title: "Сегментация сети и разграничение доступа к базам данных",
                          code: "МЕР-171185",
                          date: "Фактическая дата: 26.01.2024",
                          status: "Реализована"
                        },
                        {
                          title: "Внедрение двухфакторной аутентификации для всех сотрудников",
                          code: "МЕР-171185",
                          date: "Фактическая дата: 10.02.2024",
                          status: "Реализована"
                        },
                        {
                          title: "Шифрование данных в состоянии покоя",
                          code: "МЕР-171185",
                          date: "Фактическая дата: 20.02.2024",
                          status: "Реализована"
                        }
                      ].map((measure, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-compBlue-100 dark:bg-compBlue-900/30 rounded-full flex items-center justify-center">
                                <Shield className="w-4 h-4 text-compBlue-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{measure.title}</p>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className="text-xs text-muted-foreground">{measure.code}</span>
                                  <span className="text-xs text-muted-foreground">{measure.date}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={measure.status === "Реализована" ? "default" : "secondary"} className="text-xs">
                                {measure.status}
                              </Badge>
                              <Button size="sm" variant="ghost">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar for Measures tab */}
                <div className="space-y-4">
                  <Card className="p-4">
                    <h4 className="font-medium mb-3">Информация</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Риск</span>
                        <span>RSK-41242001</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Создан</span>
                        <span>20 февраля 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Обновлен</span>
                        <span>20 февраля 2024</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Автор</span>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full overflow-hidden">
                            <img 
                              src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                              alt="AI Assistant" 
                              className="w-full h-full"
                            />
                          </div>
                          <span>NORM AI</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="border-t p-6">
          <div className="flex justify-between">
            <Button variant="outline" onClick={onClose}>
              Удалить
            </Button>
            <Button variant="outline" onClick={onClose}>
              Отклонить
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}