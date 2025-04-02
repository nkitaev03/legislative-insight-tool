
import { useState } from 'react';
import { Search, Filter, Calendar, AlertCircle, Download, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RiskIndicator from '../common/RiskIndicator';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Extended legislation data with risks, recommendations, and responsible person
const legislationChanges = [
  {
    id: '1',
    title: 'Об изменениях в Федеральном законе "О защите персональных данных"',
    date: '12.05.2023',
    description: 'Ужесточение требований к операторам персональных данных. Введение дополнительных обязанностей по обеспечению безопасности персональных данных и новые штрафы за их невыполнение.',
    category: 'Персональные данные',
    source: 'Государственная Дума РФ',
    sourceUrl: 'https://regulation.gov.ru/example1',
    risk: 'high',
    isNew: true,
    responsible: 'Иванов И.И., Директор IT-отдела',
    risks: [
      'Штрафы до 500 тыс. руб. за несоответствие новым требованиям',
      'Приостановление деятельности до 90 дней при утечке данных',
      'Репутационные риски при публичном раскрытии инцидентов'
    ],
    recommendations: [
      'Обновить политику обработки персональных данных до 01.06.2023',
      'Провести аудит систем хранения данных клиентов',
      'Назначить ответственного за защиту персональных данных'
    ]
  },
  {
    id: '2',
    title: 'Постановление Правительства РФ об учете рабочего времени',
    date: '05.05.2023',
    description: 'Обновленный порядок ведения учета рабочего времени сотрудников. Новые формы отчетности и требования к электронному документообороту.',
    category: 'Трудовое право',
    source: 'Правительство РФ',
    sourceUrl: 'https://regulation.gov.ru/example2',
    risk: 'medium',
    isNew: true,
    responsible: 'Петрова А.С., HR-директор',
    risks: [
      'Штрафы за некорректный учет рабочего времени',
      'Риск судебных исков от сотрудников при невыплате сверхурочных',
      'Административная ответственность при проверке трудовой инспекцией'
    ],
    recommendations: [
      'Обновить систему учета рабочего времени',
      'Провести обучение HR-специалистов',
      'Внести изменения в правила внутреннего трудового распорядка'
    ]
  },
  {
    id: '3',
    title: 'Изменения в налоговом законодательстве',
    date: '28.04.2023',
    description: 'Поправки в исчислении НДС для IT-компаний. Установление новых льгот и преференций для компаний, занимающихся разработкой программного обеспечения.',
    category: 'Налоговое право',
    source: 'Министерство финансов',
    sourceUrl: 'https://regulation.gov.ru/example3',
    risk: 'medium',
    isNew: false,
    responsible: 'Смирнова Е.В., Главный бухгалтер',
    risks: [
      'Упущенная выгода при неприменении новых льгот',
      'Доначисления при неверном применении льготных ставок',
      'Усиление налогового контроля за IT-компаниями'
    ],
    recommendations: [
      'Провести анализ возможности применения новых льгот',
      'Обновить учетную политику организации',
      'Подготовить документы для подтверждения права на льготы'
    ]
  },
  {
    id: '4',
    title: 'О внесении изменений в закон "О техническом регулировании"',
    date: '15.04.2023',
    description: 'Изменение требований к сертификации продукции. Упрощение процедур для малого бизнеса и введение новых требований к маркировке.',
    category: 'Техническое регулирование',
    source: 'Министерство промышленности',
    sourceUrl: 'https://regulation.gov.ru/example4',
    risk: 'low',
    isNew: false,
    responsible: 'Козлов А.А., Руководитель отдела качества',
    risks: [
      'Запрет на реализацию продукции при отсутствии новой маркировки',
      'Административная ответственность за нарушение требований',
      'Затраты на обновление упаковки продукции'
    ],
    recommendations: [
      'Изучить новые требования к маркировке',
      'Обновить дизайн упаковки',
      'Провести обучение персонала отдела качества'
    ]
  },
  {
    id: '5',
    title: 'Новые правила маркировки товаров',
    date: '10.04.2023',
    description: 'Расширение перечня товаров, подлежащих обязательной маркировке. Новые сроки внедрения системы маркировки для различных групп товаров.',
    category: 'Торговля',
    source: 'Министерство промышленности и торговли',
    sourceUrl: 'https://regulation.gov.ru/example5',
    risk: 'high',
    isNew: false,
    responsible: 'Никитин В.П., Коммерческий директор',
    risks: [
      'Полный запрет продаж немаркированной продукции с 01.07.2023',
      'Штрафы до 300 тыс. руб. за нарушение правил маркировки',
      'Изъятие товаров без маркировки из оборота'
    ],
    recommendations: [
      'Зарегистрироваться в системе "Честный ЗНАК"',
      'Приобрести оборудование для считывания кодов маркировки',
      'Обновить учетную систему для работы с маркированными товарами'
    ]
  },
];

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  
  // Find the selected legislation for dialog
  const selectedLegislation = legislationChanges.find(item => item.id === openDialogId);
  
  // Filter items based on search, risk level and date
  const filteredItems = legislationChanges.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || item.risk === selectedRisk;
    const matchesDate = selectedDate === 'all' || 
                        (selectedDate === 'recent' && new Date(item.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                        (selectedDate === 'older' && new Date(item.date) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesRisk && matchesDate;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Мониторинг законодательства</h1>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по названию или содержанию..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Уровень риска" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedDate} onValueChange={setSelectedDate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Любая дата</SelectItem>
                    <SelectItem value="recent">Последние 30 дней</SelectItem>
                    <SelectItem value="older">Старше 30 дней</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="secondary" className="flex-1">
                  Применить
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="all">Все изменения</TabsTrigger>
          <TabsTrigger value="new" className="relative">
            Новые
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tracked">Отслеживаемые</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Card key={item.id} className={item.isNew ? 'border-l-4 border-l-compOrange-500' : ''}>
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg flex items-center gap-2">
                          {item.title}
                          {item.isNew && (
                            <Badge variant="outline" className="text-xs bg-compOrange-50 text-compOrange-700 border-compOrange-200">
                              Новое
                            </Badge>
                          )}
                        </h3>
                        <div className="text-sm text-muted-foreground mt-1">
                          От {item.date} • {item.source}
                        </div>
                      </div>
                      <RiskIndicator level={item.risk as 'low' | 'medium' | 'high'} showLabel />
                    </div>
                    <p className="text-sm mt-3">{item.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      <Badge variant="secondary">{item.category}</Badge>
                      <span className="text-sm text-muted-foreground">Ответственный: {item.responsible}</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-3 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setOpenDialogId(item.id)}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Документы по заданным критериям не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </div>
      </Tabs>

      {/* Legislation Detail Dialog */}
      <Dialog open={!!openDialogId} onOpenChange={(open) => !open && setOpenDialogId(null)}>
        {selectedLegislation && (
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {selectedLegislation.title}
                <RiskIndicator level={selectedLegislation.risk as 'low' | 'medium' | 'high'} size="sm" showLabel />
              </DialogTitle>
              <DialogDescription>
                От {selectedLegislation.date} • {selectedLegislation.source}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Описание</h3>
                <p>{selectedLegislation.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Риски для компании
                </h3>
                <ul className="space-y-2 list-disc pl-5">
                  {selectedLegislation.risks.map((risk, index) => (
                    <li key={index}>{risk}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Рекомендации</h3>
                <ul className="space-y-2 list-disc pl-5">
                  {selectedLegislation.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Информация</h3>
                <div className="space-y-2">
                  <p><strong>Дата публикации:</strong> {selectedLegislation.date}</p>
                  <p><strong>Ответственный:</strong> {selectedLegislation.responsible}</p>
                  <p className="flex items-center gap-2">
                    <strong>Источник:</strong>
                    <a 
                      href={selectedLegislation.sourceUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary flex items-center gap-1 hover:underline"
                    >
                      Официальный документ <LinkIcon className="h-3 w-3" />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Закрыть</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
