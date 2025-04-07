import { useState } from 'react';
import {
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  CalendarClock,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MetricCard from '../common/MetricCard';
import RiskIndicator from '../common/RiskIndicator';
import { 
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer
} from 'recharts';
import BusinessProcessMap from './BusinessProcessMap';
import InteractiveChecklist from '../common/InteractiveChecklist';

const riskData = [
  { name: 'Высокий', value: 25, color: '#f44336' },
  { name: 'Средний', value: 30, color: '#ff9800' },
  { name: 'Низкий', value: 45, color: '#2a9e31' },
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

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl md:text-2xl font-semibold">
          <span className="mr-2">👋</span>
          Привет, Анна!
        </h1>
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
          <TabsTrigger value="tasks" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Задачи</TabsTrigger>
          <TabsTrigger value="process-map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Карта процессов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard 
              title="Новые изменения"
              value="12"
              icon={<FileText className="h-5 w-5" />}
              description="За последние 30 дней"
              trend={{ value: 8, isPositive: false }}
              variant="warning"
            />
            <MetricCard 
              title="Уровень риска"
              value="45%"
              icon={<AlertTriangle className="h-5 w-5" />}
              description="Общий показатель"
              trend={{ value: 5, isPositive: true }}
              variant="danger"
            />
            <MetricCard 
              title="Закрытые задачи"
              value="68%"
              icon={<CheckCircle className="h-5 w-5" />}
              description="18 из 26"
              trend={{ value: 12, isPositive: true }}
              variant="success"
            />
            <MetricCard 
              title="Ближайший срок"
              value="5 дней"
              icon={<Clock className="h-5 w-5" />}
              description="До 18.05.2023"
            />
          </div>

          {/* Risk Distribution Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Распределение рисков</CardTitle>
                <CardDescription>По уровню важности</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={renderCustomizedLabel}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center"
                      formatter={(value, entry, index) => (
                        <span className="text-sm font-medium">{value}</span>
                      )}
                    />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

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
          </div>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-200">
            <CardHeader className="pb-2">
              <CardTitle>Приоритетные задачи</CardTitle>
              <CardDescription>Задачи, требующие выполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                      task.status === 'completed' 
                        ? 'bg-muted/50' 
                        : task.risk === 'high' 
                          ? 'bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30' 
                          : task.risk === 'medium' 
                            ? 'bg-amber-50 dark:bg-amber-950/20 hover:bg-amber-100 dark:hover:bg-amber-950/30' 
                            : 'bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-compGreen-500" />
                      ) : task.risk === 'high' ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : task.risk === 'medium' ? (
                        <AlertTriangle className="h-5 w-5 text-compOrange-500" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-compGreen-500" />
                      )}
                      <div>
                        <p className={`font-medium ${task.status === 'completed' && 'text-muted-foreground line-through'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarClock className="h-3 w-3" />
                            <span>Срок: {task.deadline}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>Отв.: {task.responsible}</span>
                          </div>
                          <RiskIndicator level={task.risk as 'low' | 'medium' | 'high'} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <button className="text-xs bg-background border border-border px-3 py-1 rounded hover:bg-muted transition-colors">
                          {task.status === 'in-progress' ? 'Завершить' : 'Начать'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="process-map" className="space-y-4">
          <BusinessProcessMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
