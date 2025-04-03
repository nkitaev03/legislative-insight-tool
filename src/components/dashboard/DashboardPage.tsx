
import { useState } from 'react';
import {
  BarChart3,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Shield,
  CalendarClock,
  AlertCircle
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer
} from 'recharts';
import BusinessProcessMap from './BusinessProcessMap';
import InteractiveChecklist from '../common/InteractiveChecklist';

const riskData = [
  { name: 'Высокий', value: 15, color: '#f44336' },
  { name: 'Средний', value: 30, color: '#ff9800' },
  { name: 'Низкий', value: 55, color: '#2a9e31' },
];

const risksByType = [
  { subject: 'Операционные', A: 85, fullMark: 100 },
  { subject: 'Юридические', A: 65, fullMark: 100 },
  { subject: 'Финансовые', A: 40, fullMark: 100 },
  { subject: 'Регуляторные', A: 90, fullMark: 100 },
  { subject: 'Репутационные', A: 30, fullMark: 100 },
  { subject: 'Стратегические', A: 45, fullMark: 100 },
];

const tasks = [
  { 
    id: 1, 
    title: 'Обновить политику конфиденциальности', 
    deadline: '18.05.2023', 
    risk: 'high',
    status: 'pending'
  },
  { 
    id: 2, 
    title: 'Провести аудит договоров с контрагентами', 
    deadline: '24.05.2023', 
    risk: 'medium',
    status: 'in-progress'
  },
  { 
    id: 3, 
    title: 'Обновить внутренние регламенты', 
    deadline: '02.06.2023', 
    risk: 'medium',
    status: 'pending'
  },
  { 
    id: 4, 
    title: 'Прохождение обязательного обучения', 
    deadline: '15.06.2023', 
    risk: 'low',
    status: 'completed'
  },
  { 
    id: 5, 
    title: 'Подготовка отчета о соответствии', 
    deadline: '30.06.2023', 
    risk: 'low',
    status: 'pending'
  },
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
    deadline: new Date('2023-06-15')
  },
  {
    id: '5',
    text: 'Обновить договоры с контрагентами с учетом новых требований',
    completed: false
  }
];

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
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
        <h1 className="text-2xl font-semibold">Обзор комплаенс-рисков</h1>
      </div>
      
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
          <TabsTrigger value="process-map">Карта процессов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard 
              title="Изменения в НПА"
              value="12"
              icon={<FileText className="h-5 w-5" />}
              description="За последние 30 дней"
              trend={{ value: 8, isPositive: false }}
              variant="warning"
            />
            <MetricCard 
              title="Комплаенс-риски"
              value="45%"
              icon={<AlertTriangle className="h-5 w-5" />}
              description="Общий уровень"
              trend={{ value: 5, isPositive: true }}
              variant="danger"
            />
            <MetricCard 
              title="Выполненные задачи"
              value="68%"
              icon={<CheckCircle className="h-5 w-5" />}
              description="18 из 26 задач"
              trend={{ value: 12, isPositive: true }}
              variant="success"
            />
            <MetricCard 
              title="Следующий дедлайн"
              value="5 дней"
              icon={<Clock className="h-5 w-5" />}
              description="До 18.05.2023"
            />
          </div>

          {/* Risk Distribution Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Распределение рисков</CardTitle>
                <CardDescription>По уровню важности</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={riskData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
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

            <Card>
              <CardHeader>
                <CardTitle>Типы рисков</CardTitle>
                <CardDescription>Распределение по категориям</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={risksByType}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Уровень риска"
                      dataKey="A"
                      stroke="#1cb16b"
                      fill="#1cb16b"
                      fillOpacity={0.6}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Checklist */}
          <div className="grid grid-cols-1 gap-6">
            <InteractiveChecklist 
              title="План устранения рисков несоответствия"
              description="Выполните следующие шаги для минимизации рисков"
              items={checklistItems}
            />
          </div>

          {/* Latest Risk Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Последние предупреждения</CardTitle>
              <CardDescription>Новые и важные комплаенс-риски</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Новый законопроект о защите данных', level: 'high', date: '12.05.2023', desc: 'Требуется анализ влияния на бизнес-процессы' },
                  { title: 'Изменение требований к отчетности', level: 'medium', date: '10.05.2023', desc: 'Необходимо обновить внутренние документы' },
                  { title: 'Обновление антимонопольного законодательства', level: 'medium', date: '05.05.2023', desc: 'Требуется пересмотр договоров с партнерами' },
                ].map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/40">
                    <div className="mt-1">
                      <RiskIndicator level={alert.level as 'low' | 'medium' | 'high'} size="md" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{alert.title}</h4>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Приоритетные задачи</CardTitle>
              <CardDescription>Задачи, требующие выполнения</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      task.status === 'completed' 
                        ? 'bg-muted/50' 
                        : task.risk === 'high' 
                          ? 'bg-red-50 dark:bg-red-950/20' 
                          : task.risk === 'medium' 
                            ? 'bg-amber-50 dark:bg-amber-950/20' 
                            : 'bg-emerald-50 dark:bg-emerald-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-compGreen-500" />
                      ) : task.risk === 'high' ? (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      ) : task.risk === 'medium' ? (
                        <AlertTriangle className="h-5 w-5 text-compOrange-500" />
                      ) : (
                        <Shield className="h-5 w-5 text-compGreen-500" />
                      )}
                      <div>
                        <p className={`font-medium ${task.status === 'completed' && 'text-muted-foreground line-through'}`}>{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <CalendarClock className="h-3 w-3" />
                            <span>Срок: {task.deadline}</span>
                          </div>
                          <RiskIndicator level={task.risk as 'low' | 'medium' | 'high'} size="sm" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && (
                        <button className="text-xs bg-background border border-border px-3 py-1 rounded hover:bg-muted">
                          {task.status === 'in-progress' ? 'Выполнить' : 'Начать'}
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
