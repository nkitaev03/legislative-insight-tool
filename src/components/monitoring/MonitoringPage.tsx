import { useState } from 'react';
import { Search, Filter, Calendar, AlertCircle, Download, Link as LinkIcon, User, FileWarning, ListTodo, Info, CheckCircle, X, Target, TrendingUp } from 'lucide-react';
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
import LegislationTimeline from './LegislationTimeline';
import CompetitiveAdvantageList from './CompetitiveAdvantageList';
import LegislationDetailModal from './LegislationDetailModal';

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
    },
    strategicImpact: 'Критическое влияние на стратегию защиты данных компании. Требуется пересмотр процессов обработки персональных данных, что затрагивает все подразделения.',
    implementationDate: '01.08.2023',
    competitiveAdvantages: [
      'Возможность позиционирования как компании с высоким уровнем защиты данных клиентов',
      'Развитие уникальных компетенций в области кибербезопасности',
      'Снижение рисков утечек по сравнению с конкурентами, не соответствующими новым требованиям'
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
    },
    strategicImpact: 'Снижение налоговой нагрузки позволит высвободить средства для реализации стратегии цифровой трансформации компании.',
    implementationDate: '01.07.2023',
    competitiveAdvantages: [
      'Снижение себестоимости продукции на 5-7% по сравнению с конкурентами',
      'Возможность снижения цен или увеличения рентабельности',
      'Дополнительные инвестиции в R&D при сохранении текущего уровня цен'
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
    ],
    financialImpact: {
      min: 20000,
      max: 80000,
      expected: 45000
    },
    strategicImpact: 'Незначительное влияние на стратегию, требуется лишь техническое соответствие.',
    implementationDate: '01.12.2023'
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
    },
    strategicImpact: 'Влияет на стратегию дистрибуции и логистики. Требуется перестройка цепочки поставок с учетом новых требований к маркировке.',
    implementationDate: '15.06.2023'
  },
  {
    id: '6',
    title: 'Закон о поддержке IT-стартапов',
    date: '05.07.2023',
    description: 'Новая программа субсидирования и грантовой поддержки для IT-стартапов, занимающихся разработкой инновационных технологий.',
    category: 'Налоговое право',
    source: 'Министерство цифрового развития',
    sourceUrl: 'https://regulation.gov.ru/example6',
    risk: 'low',
    isNew: true,
    responsible: 'Смирнова Е.В., Главный бухгалтер',
    risks: [
      'Повышенное внимание налоговых органов при получении субсидий',
      'Необходимость дополнительной отчетности по целевому использованию средств',
      'Репутационные риски при неосвоении полученных грантов'
    ],
    recommendations: [
      { text: 'Подготовить проект для заявки на грант', responsible: '', status: 'pending' },
      { text: 'Сформировать отдельную команду для работы с государственными проектами', responsible: '', status: 'pending' },
      { text: 'Разработать систему внутреннего учета для контроля целевого использования средств', responsible: '', status: 'pending' }
    ],
    financialImpact: {
      min: -5000000,
      max: -2000000,
      expected: -3500000
    },
    strategicImpact: 'Критически важно для реализации стратегии инновационного развития. Позволяет получить государственное финансирование для разработки новых продуктов.',
    implementationDate: '01.09.2023',
    competitiveAdvantages: [
      'Возможность получения значительного финансирования для развития новых направлений',
      'Снижение финансовой нагрузки на R&D бюджет компании',
      'Доступ к государственным каналам продвижения и пилотирования продуктов',
      'Преимущество перед конкурентами, не участвующими в программе поддержки'
    ]
  }
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
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
        <h1 className="text-2xl font-semibold">Мониторинг законодательства и новостей</h1>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <FileWarning className="h-5 w-5 text-orange-500" />
            Фильтрация и поиск
          </CardTitle>
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2">
                  <Calendar className="h-4 w-4" />
                  Период
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="all">Все события</TabsTrigger>
          <TabsTrigger value="laws">Законодательство</TabsTrigger>
          <TabsTrigger value="news">Новости</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="space-y-1">
            {[...filteredLegislation.map(item => ({...item, type: 'legislation'})), 
              ...filteredNews.map(item => ({...item, type: 'news'}))]
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {item.type === 'legislation' ? (
                    <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                      <FileWarning className="w-4 h-4 text-blue-600" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-blue-600">
                      {item.type === 'legislation' ? 'Законодательство' : 'Новость'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    onClick={() => {
                      setOpenDialogId(item.id);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Принять меры →
                  </button>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="laws" className="mt-6">
          <div className="space-y-1">
            {filteredLegislation
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded bg-blue-100 flex items-center justify-center">
                    <FileWarning className="w-4 h-4 text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-blue-600">Законодательство</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    onClick={() => {
                      setOpenDialogId(item.id);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Принять меры →
                  </button>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="news" className="mt-6">
          <div className="space-y-1">
            {filteredNews
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((item) => (
              <div key={item.id} className="flex items-start gap-4 p-4 hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded bg-orange-100 flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-blue-600">Новость</span>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    onClick={() => {
                      setOpenDialogId(item.id);
                      setIsDetailModalOpen(true);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Принять меры →
                  </button>
                </div>
                
                <div className="flex-shrink-0 text-right">
                  <div className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* New Legislation Detail Modal */}
      <LegislationDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setOpenDialogId(null);
        }}
        item={selectedItem}
      />
    </div>
  );
}
