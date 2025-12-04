
import { useState } from 'react';
import {
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  CalendarClock,
  ArrowUpRight,
  DollarSign,
  Percent,
  TrendingUp,
  TrendingDown,
  LineChart,
  X,
  Search,
  Send
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '../common/MetricCard';
import RiskIndicator from '../common/RiskIndicator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import BusinessProcessMap from './BusinessProcessMap';
import InteractiveChecklist from '../common/InteractiveChecklist';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const riskData = [
  { name: 'Высокий', value: 25, color: '#f44336' },
  { name: 'Средний', value: 30, color: '#ff9800' },
  { name: 'Низкий', value: 45, color: '#2a9e31' },
];

// Macro parameters impact data
const macroParametersData = [
  { parameter: 'Ставка ЦБ', current: '16%', impact: 'высокое', change: '+2%', trend: 'up' },
  { parameter: 'Инфляция', current: '7.4%', impact: 'среднее', change: '-0.3%', trend: 'down' },
  { parameter: 'Цена нефти', current: '$85', impact: 'среднее', change: '+$3', trend: 'up' },
  { parameter: 'Курс USD/RUB', current: '92₽', impact: 'высокое', change: '+2.5₽', trend: 'up' },
  { parameter: 'Объем рынка', current: '1.2T₽', impact: 'низкое', change: '+4%', trend: 'up' },
];

// Risk impact data for bar chart
const riskImpactData = [
  { category: 'Финансовые', high: 14, medium: 8, low: 6 },
  { category: 'Юридические', high: 8, medium: 12, low: 5 },
  { category: 'Операционные', high: 5, medium: 9, low: 15 },
  { category: 'Технологические', high: 7, medium: 11, low: 9 },
];

// Checklist items for the interactive checklist
const checklistItems = [
  {
    id: '1',
    text: 'Обновить политику конфиденциальности в соответствии с новыми требованиями',
    completed: false,
    responsible: 'Иванов И.И.'
  },
  {
    id: '2',
    text: 'Провести аудит систем хранения персональных данных',
    completed: true,
    deadline: new Date('2023-05-30'),
    responsible: 'Петрова А.С.'
  },
  {
    id: '3',
    text: 'Назначить ответственного за защиту персональных данных',
    completed: false,
    reminders: true,
    responsible: 'Смирнова Е.В.'
  },
  {
    id: '4',
    text: 'Внедрить систему контроля доступа к конфиденциальным данным',
    completed: false,
    deadline: new Date('2023-06-15'),
    responsible: 'Соколов Д.М.'
  },
  {
    id: '5',
    text: 'Обновить договоры с контрагентами с учетом новых требований',
    completed: false,
    responsible: 'Козлов А.И.'
  }
];

const tasks = [
  { 
    id: 1, 
    title: 'Обновить политику конфиденциальности', 
    deadline: '18.05.2023', 
    risk: 'high',
    status: 'pending',
    responsible: 'Иванов И.И.'
  },
  { 
    id: 2, 
    title: 'Провести аудит договоров с контрагентами', 
    deadline: '24.05.2023', 
    risk: 'medium',
    status: 'in-progress',
    responsible: 'Петрова А.С.'
  },
  { 
    id: 3, 
    title: 'Обновить внутренние регламенты', 
    deadline: '02.06.2023', 
    risk: 'medium',
    status: 'pending',
    responsible: 'Смирнова Е.В.'
  },
  { 
    id: 4, 
    title: 'Прохождение обязательного обучения', 
    deadline: '15.06.2023', 
    risk: 'low',
    status: 'completed',
    responsible: 'Соколов Д.М.'
  },
  { 
    id: 5, 
    title: 'Подготовка отчета о соответствии', 
    deadline: '30.06.2023', 
    risk: 'low',
    status: 'pending',
    responsible: 'Козлов А.И.'
  },
];

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');
  const [metricChartOpen, setMetricChartOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<{
    title: string;
    data: any[];
    dataKey: string;
    color: string;
    formatter?: (value: any) => string;
  } | null>(null);

  // Define chart data for each metric
  const metricCharts = {
    profit: {
      title: "Динамика прибыли",
      data: [
        { month: 'Янв', value: 9.2 },
        { month: 'Фев', value: 10.1 },
        { month: 'Мар', value: 10.8 },
        { month: 'Апр', value: 11.5 },
        { month: 'Май', value: 11.9 },
        { month: 'Июн', value: 12.7 }
      ],
      dataKey: "value",
      color: "#10b981",
      formatter: (value: number) => `${value}M₽`
    },
    margin: {
      title: "Динамика маржинальности",
      data: [
        { month: 'Янв', value: 15.8 },
        { month: 'Фев', value: 16.2 },
        { month: 'Мар', value: 16.9 },
        { month: 'Апр', value: 17.3 },
        { month: 'Май', value: 17.8 },
        { month: 'Июн', value: 18.2 }
      ],
      dataKey: "value",
      color: "#8884d8",
      formatter: (value: number) => `${value}%`
    },
    expenses: {
      title: "Операционные расходы",
      data: [
        { month: 'Янв', value: 9.8 },
        { month: 'Фев', value: 9.7 },
        { month: 'Мар', value: 9.6 },
        { month: 'Апр', value: 9.4 },
        { month: 'Май', value: 9.3 },
        { month: 'Июн', value: 9.2 }
      ],
      dataKey: "value",
      color: "#ef4444",
      formatter: (value: number) => `${value}M₽`
    },
    risks: {
      title: "Оценка рисков",
      data: [
        { category: 'Финансовые', value: 32.1 },
        { category: 'Операционные', value: 18.7 },
        { category: 'Юридические', value: 15.2 },
        { category: 'Рыночные', value: 12.4 }
      ],
      dataKey: "value",
      color: "#f59e0b",
      formatter: (value: number) => `${value}M₽`
    }
  };

  const handleMetricCardClick = (metricType: 'profit' | 'margin' | 'expenses' | 'risks') => {
    setSelectedMetric(metricCharts[metricType]);
    setMetricChartOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log('Поиск:', searchQuery);
      // Here you can add search functionality
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Привет, Никита!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Меня зовут <span className="font-semibold text-foreground">RiskAI</span> — я твой помощник в сфере рисков
          </p>
        </div>
        
        <div className="max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Задайте вопрос о рисках или компании..."
              className="w-full h-12 pl-12 pr-12 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-secondary/40 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Я оценил ситуацию и собрал всё самое важное</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Законодательство</span>
                  <span>•</span>
                  <span className="text-orange-500">Повышенные риски</span>
                </div>
                <h3 className="font-medium mb-1">Обработка персональных данных</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ужесточились требования к обработке персональных данных и существенно выросли штрафы за выявленные нарушения.
                </p>
                <button className="feature-button">
                  Обновить оборудование
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Новость</span>
                  <span>•</span>
                  <span className="text-orange-500">Повышенные риски</span>
                </div>
                <h3 className="font-medium mb-1">Магазин-склад закрыт Роспотребнадзором</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Невский районный суд Петербурга закрыл магазин-склад из-за нарушений санитарных требований.
                </p>
                <button className="feature-button">
                  Защитить пользователей
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Мера</span>
                  <span>•</span>
                  <span className="text-orange-500">Просрочено на 14 дней</span>
                </div>
                <h3 className="font-medium mb-1">Немного задержались с этой мерой</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Если не навёрстать упущенное, возможны задержки в других процессах. Давай не допустим эффекта домино.
                </p>
                <button className="feature-button">
                  Исправить ситуацию
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Обзор</TabsTrigger>
          <TabsTrigger value="process-map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Карта процессов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Financial Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div onClick={() => handleMetricCardClick('profit')} className="cursor-pointer">
              <MetricCard 
                title="Прибыль Q2 2023"
                value="12.7M₽"
                icon={<DollarSign className="h-5 w-5" />}
                description="План: 12.4M₽"
                trend={{ value: 8, isPositive: true }}
                variant="success"
              />
            </div>
            <div onClick={() => handleMetricCardClick('margin')} className="cursor-pointer">
              <MetricCard 
                title="Маржинальность"
                value="18.2%"
                icon={<Percent className="h-5 w-5" />}
                description="Прошлый квартал: 17.5%"
                trend={{ value: 4, isPositive: true }}
                variant="success"
              />
            </div>
            <div onClick={() => handleMetricCardClick('expenses')} className="cursor-pointer">
              <MetricCard 
                title="Операционные расходы"
                value="9.2M₽"
                icon={<TrendingDown className="h-5 w-5" />}
                description="План: 9.5M₽"
                trend={{ value: 3, isPositive: true }}
                variant="success"
              />
            </div>
            <div onClick={() => handleMetricCardClick('risks')} className="cursor-pointer">
              <MetricCard 
                title="Оценка рисков"
                value="78.4M₽"
                icon={<AlertTriangle className="h-5 w-5" />}
                description="Потенциальные убытки"
                trend={{ value: 12, isPositive: false }}
                variant="danger"
              />
            </div>
          </div>


          {/* Macro Parameters and Risk Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Macro Parameters */}
            <Card className="hover-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Макропараметры</CardTitle>
                <CardDescription>Ключевые показатели и их влияние</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Параметр</TableHead>
                        <TableHead>Значение</TableHead>
                        <TableHead>Изменение</TableHead>
                        <TableHead>Влияние</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {macroParametersData.map((param, idx) => (
                        <TableRow key={idx}>
                          <TableCell className="font-medium">{param.parameter}</TableCell>
                          <TableCell>{param.current}</TableCell>
                          <TableCell>
                            <span className={`flex items-center ${param.trend === 'up' ? 'text-red-500' : 'text-green-500'}`}>
                              {param.change}
                              {param.trend === 'up' ? <TrendingUp className="h-3 w-3 ml-1" /> : <TrendingDown className="h-3 w-3 ml-1" />}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              param.impact === 'высокое' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                              param.impact === 'среднее' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' :
                              'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            }`}>
                              {param.impact}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Risk Impact Chart (replacing pie chart) */}
            <Card className="hover-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Распределение рисков</CardTitle>
                <CardDescription>По категориям и уровням важности</CardDescription>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={riskImpactData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    barSize={20}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        return [value, name === 'high' ? 'Высокий' : name === 'medium' ? 'Средний' : 'Низкий'];
                      }}
                    />
                    <Legend 
                      formatter={(value) => (
                        value === 'high' ? 'Высокий' : 
                        value === 'medium' ? 'Средний' : 'Низкий'
                      )}
                    />
                    <Bar 
                      dataKey="high" 
                      stackId="a" 
                      fill="#f44336" 
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="medium" 
                      stackId="a" 
                      fill="#ff9800"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar 
                      dataKey="low" 
                      stackId="a" 
                      fill="#2a9e31"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Checklist */}
          <Card className="hover-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">План устранения рисков</CardTitle>
              <CardDescription>Приоритетные задачи</CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveChecklist 
                items={checklistItems.slice(0, 3)}
                compact
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process-map" className="space-y-4">
          <BusinessProcessMap />
        </TabsContent>
      </Tabs>

      {/* Metric Chart Dialog */}
      <Dialog open={metricChartOpen} onOpenChange={setMetricChartOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>{selectedMetric?.title}</DialogTitle>
            <button 
              onClick={() => setMetricChartOpen(false)}
              className="rounded-full p-1 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </DialogHeader>
          <div className="h-[400px] mt-4">
            {selectedMetric && (
              selectedMetric.title === "Оценка рисков" ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={selectedMetric.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => `${value}M₽`} />
                    <Tooltip formatter={(value) => [`${value}M₽`, 'Потенциальные убытки']} />
                    <Bar 
                      dataKey={selectedMetric.dataKey} 
                      fill={selectedMetric.color}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={selectedMetric.data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => selectedMetric.formatter ? selectedMetric.formatter(value) : value} />
                    <Tooltip formatter={(value) => [selectedMetric.formatter ? selectedMetric.formatter(value) : value, '']} />
                    <Line 
                      type="monotone" 
                      dataKey={selectedMetric.dataKey} 
                      stroke={selectedMetric.color}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
