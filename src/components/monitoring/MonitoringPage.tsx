
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
import { LegislationItem, NewsItem } from './types';
import LegislationList from './LegislationList';
import NewsList from './NewsList';

// Extended legislation data with risks, recommendations, and responsible person
const initialLegislationChanges: LegislationItem[] = [
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
    ],
    financialImpact: {
      min: 100000,
      max: 500000,
      expected: 350000
    }
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
    ],
    financialImpact: {
      min: 50000,
      max: 200000,
      expected: 120000
    }
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
    ],
    financialImpact: {
      min: -300000,
      max: 0,
      expected: -150000
    }
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
    ],
    financialImpact: {
      min: 20000,
      max: 80000,
      expected: 45000
    }
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
    ],
    financialImpact: {
      min: 100000,
      max: 300000,
      expected: 180000
    }
  },
];

// News data
const initialNewsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Центробанк поднял ключевую ставку до 16%',
    date: '15.05.2023',
    description: 'Банк России объявил о повышении ключевой ставки на 2 процентных пункта. Решение принято в связи с ускорением инфляции и необходимостью стабилизации курса рубля.',
    category: 'Экономика',
    source: 'Центральный Банк РФ',
    sourceUrl: 'https://cbr.ru/example1',
    risk: 'high',
    isNew: true,
    responsible: '',
    risks: [
      'Удорожание кредитных ресурсов для бизнеса',
      'Снижение маржинальности по долгосрочным контрактам',
      'Рост стоимости обслуживания кредитного портфеля'
    ],
    recommendations: [
      { text: 'Пересмотреть инвестиционные планы на ближайший квартал', responsible: '', status: 'pending' },
      { text: 'Провести анализ кредитного портфеля компании', responsible: '', status: 'pending' },
      { text: 'Обновить финансовую модель с учетом новых ставок', responsible: '', status: 'pending' }
    ],
    financialImpact: {
      min: 200000,
      max: 750000,
      expected: 450000
    }
  },
  {
    id: '2',
    title: 'Рост цен на энергоносители в 2023 году',
    date: '10.05.2023',
    description: 'Аналитики прогнозируют рост цен на электроэнергию и газ для промышленных предприятий на 15-20% в текущем году. Основные причины - инфляция и обновление тарифной политики.',
    category: 'Энергетика',
    source: 'Министерство энергетики',
    sourceUrl: 'https://minenergo.gov.ru/example2',
    risk: 'medium',
    isNew: true,
    responsible: '',
    risks: [
      'Увеличение себестоимости продукции',
      'Снижение конкурентоспособности на внешних рынках',
      'Необходимость пересмотра цен для конечных потребителей'
    ],
    recommendations: [
      { text: 'Внедрить энергосберегающие технологии на производстве', responsible: '', status: 'pending' },
      { text: 'Заключить долгосрочные контракты с поставщиками энергии', responsible: '', status: 'pending' },
      { text: 'Разработать план оптимизации энергопотребления', responsible: '', status: 'pending' }
    ],
    financialImpact: {
      min: 300000,
      max: 500000,
      expected: 420000
    }
  },
  {
    id: '3',
    title: 'Новые требования к экологической отчетности',
    date: '28.04.2023',
    description: 'Росприроднадзор опубликовал разъяснения по составлению экологической отчетности за 2023 год. Изменения коснутся всех промышленных предприятий с объемом выбросов свыше установленных лимитов.',
    category: 'Экология',
    source: 'Росприроднадзор',
    sourceUrl: 'https://rpn.gov.ru/example3',
    risk: 'low',
    isNew: false,
    responsible: '',
    risks: [
      'Штрафы за несвоевременную подачу отчетности',
      'Приостановление деятельности при грубых нарушениях',
      'Дополнительные затраты на оборудование для мониторинга'
    ],
    recommendations: [
      { text: 'Обучить персонал новым требованиям отчетности', responsible: '', status: 'pending' },
      { text: 'Провести аудит текущих выбросов', responsible: '', status: 'pending' },
      { text: 'Обновить программное обеспечение для учета выбросов', responsible: '', status: 'pending' }
    ],
    financialImpact: {
      min: 50000,
      max: 150000,
      expected: 90000
    }
  }
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
  const [newsItems, setNewsItems] = useState(initialNewsItems);
  const { toast } = useToast();
  
  // Find the selected legislation for dialog
  const selectedLegislation = legislationChanges.find(item => item.id === openDialogId);
  const selectedNews = newsItems.find(item => item.id === openDialogId);
  const selectedItem = selectedLegislation || selectedNews;
  
  // Filter legislation items based on search, risk level and date
  const filteredLegislation = legislationChanges.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || item.risk === selectedRisk;
    const matchesDate = selectedDate === 'all' || 
                        (selectedDate === 'recent' && new Date(item.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                        (selectedDate === 'older' && new Date(item.date) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesRisk && matchesDate;
  });

  // Filter news items based on search, risk level and date
  const filteredNews = newsItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = selectedRisk === 'all' || item.risk === selectedRisk;
    const matchesDate = selectedDate === 'all' || 
                        (selectedDate === 'recent' && new Date(item.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) ||
                        (selectedDate === 'older' && new Date(item.date) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesRisk && matchesDate;
  });

  const handleResponsibleChange = (itemId: string, newResponsible: string, isNews: boolean = false) => {
    if (isNews) {
      setNewsItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, responsible: newResponsible } 
            : item
        )
      );
    } else {
      setLegislationChanges(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, responsible: newResponsible } 
            : item
        )
      );
    }
    setEditResponsibleId(null);
  };

  // Handle recommendation responsible change
  const handleRecommendationResponsibleChange = (itemId: string, recIndex: number, newResponsible: string, isNews: boolean = false) => {
    if (isNews) {
      setNewsItems(prev => 
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
    } else {
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
    }

    toast({
      title: "Ответственный назначен",
      description: "Для рекомендации успешно назначен ответственный",
      className: "bg-compGreen-50 border-l-4 border-compGreen-500",
    });
  };

  // Toggle recommendation status
  const handleToggleRecommendationStatus = (itemId: string, recIndex: number, isNews: boolean = false) => {
    if (isNews) {
      setNewsItems(prev => 
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
    } else {
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
    }
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
          <TabsTrigger value="laws">Законы</TabsTrigger>
          <TabsTrigger value="news" className="relative">
            Новости
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              2
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6 space-y-4">
          {filteredLegislation.length > 0 || filteredNews.length > 0 ? (
            <>
              {filteredLegislation.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Законодательные изменения</h2>
                  <LegislationList 
                    items={filteredLegislation} 
                    onOpenDialog={setOpenDialogId}
                    onEditResponsible={setEditResponsibleId}
                    editResponsibleId={editResponsibleId}
                    handleResponsibleChange={handleResponsibleChange}
                    responsiblePersons={responsiblePersons}
                  />
                </div>
              )}
              
              {filteredNews.length > 0 && (
                <div className="space-y-4 mt-8">
                  <h2 className="text-lg font-medium">Новости и события</h2>
                  <NewsList 
                    items={filteredNews} 
                    onOpenDialog={setOpenDialogId}
                    onEditResponsible={setEditResponsibleId}
                    editResponsibleId={editResponsibleId}
                    handleResponsibleChange={(id, resp) => handleResponsibleChange(id, resp, true)}
                    responsiblePersons={responsiblePersons}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Документы по заданным критериям не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="laws" className="mt-6 space-y-4">
          {filteredLegislation.length > 0 ? (
            <LegislationList 
              items={filteredLegislation} 
              onOpenDialog={setOpenDialogId}
              onEditResponsible={setEditResponsibleId}
              editResponsibleId={editResponsibleId}
              handleResponsibleChange={handleResponsibleChange}
              responsiblePersons={responsiblePersons}
            />
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Документы по заданным критериям не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="news" className="mt-6 space-y-4">
          {filteredNews.length > 0 ? (
            <NewsList 
              items={filteredNews} 
              onOpenDialog={setOpenDialogId}
              onEditResponsible={setEditResponsibleId}
              editResponsibleId={editResponsibleId}
              handleResponsibleChange={(id, resp) => handleResponsibleChange(id, resp, true)}
              responsiblePersons={responsiblePersons}
            />
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Новости по заданным критериям не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Legislation Detail Dialog */}
      <Dialog open={!!openDialogId} onOpenChange={(open) => !open && setOpenDialogId(null)}>
        {selectedItem && (
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[85vh]">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                {selectedItem.title}
                <RiskIndicator level={selectedItem.risk as 'low' | 'medium' | 'high'} size="sm" showLabel />
              </DialogTitle>
              <DialogDescription>
                От {selectedItem.date} • {selectedItem.source}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-compBlue-500" />
                  Описание
                </h3>
                <p>{selectedItem.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Риски для компании
                </h3>
                <ul className="space-y-2 list-disc pl-5">
                  {selectedItem.risks.map((risk, index) => (
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
                  {selectedItem.recommendations.map((rec, index) => (
                    <li key={index} className={`flex items-start p-3 rounded-md ${rec.status === 'completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                      <div className="flex-shrink-0 mt-0.5 mr-3">
                        <button 
                          className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            rec.status === 'completed' 
                              ? 'bg-green-500 text-white' 
                              : 'border-2 border-gray-300'
                          }`}
                          onClick={() => handleToggleRecommendationStatus(selectedItem.id, index, !!selectedNews)}
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
                            onValueChange={(value) => handleRecommendationResponsibleChange(selectedItem.id, index, value, !!selectedNews)}
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
                  <p><strong>Дата публикации:</strong> {selectedItem.date}</p>
                  
                  {/* Editable responsible person in dialog */}
                  <div className="flex items-center gap-2">
                    <strong>Ответственный:</strong>
                    <Select 
                      value={selectedItem.responsible} 
                      onValueChange={(value) => handleResponsibleChange(selectedItem.id, value, !!selectedNews)}
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
                      href={selectedItem.sourceUrl} 
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
