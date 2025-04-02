import { useState } from 'react';
import { Search, Filter, Calendar, AlertCircle, Download, Link as LinkIcon, User, FileWarning, ListTodo, Info, CheckCircle, X } from 'lucide-react';
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
import { useToast } from '@/hooks/use-toast';
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
const initialLegislationChanges = [
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
      { text: 'Обновить политику обработки персональных данных до 01.06.2023', responsible: '', status: 'pending' },
      { text: 'Провести аудит систем хранения данных клиентов', responsible: '', status: 'pending' },
      { text: 'Назначить ответственного за защиту персональных данных', responsible: '', status: 'pending' }
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
      { text: 'Обновить систему учета рабочего времени', responsible: '', status: 'pending' },
      { text: 'Провести обучение HR-специалистов', responsible: '', status: 'pending' },
      { text: 'Внести изменения в правила внутреннего трудового распорядка', responsible: '', status: 'pending' }
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
      { text: 'Провести анализ возможности применения новых льгот', responsible: '', status: 'pending' },
      { text: 'Обновить учетную политику организации', responsible: '', status: 'pending' },
      { text: 'Подготовить документы для подтверждения права на льготы', responsible: '', status: 'pending' }
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
      { text: 'Изучить новые требования к маркировке', responsible: '', status: 'pending' },
      { text: 'Обновить дизайн упаковки', responsible: '', status: 'pending' },
      { text: 'Провести обучение персонала отдела качества', responsible: '', status: 'pending' }
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
      { text: 'Зарегистрироваться в системе "Честный ЗНАК"', responsible: '', status: 'pending' },
      { text: 'Приобрести оборудование для считывания кодов маркировки', responsible: '', status: 'pending' },
      { text: 'Обновить учетную систему для работы с маркированными товарами', responsible: '', status: 'pending' }
    ]
  },
];

// List of available responsible persons
const responsiblePersons = [
  "Иванов И.И., Директор IT-отдела",
  "Петрова А.С., HR-директор",
  "Смирнова Е.В., Главный бухгалтер",
  "Козлов А.А., Руководитель отдела качества",
  "Никитин В.П., Коммерческий директор",
  "Сидоров М.Н., Юрисконсульт"
];

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [openDialogId, setOpenDialogId] = useState<string | null>(null);
  const [editResponsibleId, setEditResponsibleId] = useState<string | null>(null);
  const [legislationChanges, setLegislationChanges] = useState(initialLegislationChanges);
  const { toast } = useToast();
  
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

  const handleResponsibleChange = (itemId: string, newResponsible: string) => {
    setLegislationChanges(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, responsible: newResponsible } 
          : item
      )
    );
    setEditResponsibleId(null);
  };

  // Handle recommendation responsible change
  const handleRecommendationResponsibleChange = (itemId: string, recIndex: number, newResponsible: string) => {
    setLegislationChanges(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const updatedRecommendations = [...item.recommendations];
          updatedRecommendations[recIndex] = {
            ...updatedRecommendations[recIndex],
            responsible: newResponsible
          };
          return { ...item, recommendations: updatedRecommendations };
        }
        return item;
      })
    );

    toast({
      title: "Ответственный назначен",
      description: "Для рекомендации успешно назначен ответственный",
      className: "bg-compGreen-50 border-l-4 border-compGreen-500",
    });
  };

  // Toggle recommendation status
  const handleToggleRecommendationStatus = (itemId: string, recIndex: number) => {
    setLegislationChanges(prev => 
      prev.map(item => {
        if (item.id === itemId) {
          const updatedRecommendations = [...item.recommendations];
          const currentStatus = updatedRecommendations[recIndex].status;
          updatedRecommendations[recIndex] = {
            ...updatedRecommendations[recIndex],
            status: currentStatus === 'completed' ? 'pending' : 'completed'
          };
          return { ...item, recommendations: updatedRecommendations };
        }
        return item;
      })
    );
  };

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
                      
                      {/* Responsible Person with inline edit functionality */}
                      <div className="flex items-center gap-1 ml-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        
                        {editResponsibleId === item.id ? (
                          <Select 
                            value={item.responsible} 
                            onValueChange={(value) => handleResponsibleChange(item.id, value)}
                            onOpenChange={(open) => {
                              if (!open) setEditResponsibleId(null);
                            }}
                          >
                            <SelectTrigger className="h-7 text-xs w-[250px]">
                              <SelectValue placeholder="Выберите ответственного" />
                            </SelectTrigger>
                            <SelectContent>
                              {responsiblePersons.map(person => (
                                <SelectItem key={person} value={person}>{person}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span 
                            className="text-sm text-muted-foreground cursor-pointer hover:text-foreground hover:underline"
                            onClick={() => setEditResponsibleId(item.id)}
                          >
                            {item.responsible || "Назначить ответственного"}
                          </span>
                        )}
                      </div>
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
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-compBlue-500" />
                  Описание
                </h3>
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
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <ListTodo className="h-5 w-5 text-compGreen-500" />
                  Рекомендации
                </h3>
                <ul className="space-y-3 pl-0 list-none">
                  {selectedLegislation.recommendations.map((rec, index) => (
                    <li key={index} className={`flex items-start p-3 rounded-md ${rec.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <button 
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            rec.status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : 'border-2 border-gray-300'
                          }`}
                          onClick={() => handleToggleRecommendationStatus(selectedLegislation.id, index)}
                        >
                          {rec.status === 'completed' && <CheckCircle className="h-3 w-3" />}
                        </button>
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${rec.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                          {rec.text}
                        </p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Ответственный:</span>
                          <Select 
                            value={rec.responsible} 
                            onValueChange={(value) => handleRecommendationResponsibleChange(selectedLegislation.id, index, value)}
                          >
                            <SelectTrigger className="h-7 text-xs min-w-[200px]">
                              <SelectValue placeholder="Назначить ответственного" />
                            </SelectTrigger>
                            <SelectContent>
                              {responsiblePersons.map(person => (
                                <SelectItem key={person} value={person}>{person}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <Info className="h-5 w-5 text-compPurple-500" />
                  Информация
                </h3>
                <div className="space-y-2">
                  <p><strong>Дата публикации:</strong> {selectedLegislation.date}</p>
                  
                  {/* Editable responsible person in dialog */}
                  <div className="flex items-center gap-2">
                    <strong>Ответственный:</strong>
                    <Select 
                      value={selectedLegislation.responsible} 
                      onValueChange={(value) => handleResponsibleChange(selectedLegislation.id, value)}
                    >
                      <SelectTrigger className="h-8 w-[250px]">
                        <SelectValue placeholder="Выберите ответственного" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsiblePersons.map(person => (
                          <SelectItem key={person} value={person}>{person}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
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
