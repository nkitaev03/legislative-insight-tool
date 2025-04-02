
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
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const riskData = [
  { name: 'Высокий', value: 15, color: '#f44336' },
  { name: 'Средний', value: 30, color: '#ff9800' },
  { name: 'Низкий', value: 55, color: '#2a9e31' },
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

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Обзор комплаенс-рисков</h1>
      </div>
      
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="trends">Тренды</TabsTrigger>
          <TabsTrigger value="tasks">Задачи</TabsTrigger>
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

          {/* Risk Distribution Chart */}
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Сезонность изменений</CardTitle>
                <CardDescription>Динамика изменений НПА по кварталам</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Q1-2022', value: 24 },
                      { month: 'Q2-2022', value: 13 },
                      { month: 'Q3-2022', value: 15 },
                      { month: 'Q4-2022', value: 30 },
                      { month: 'Q1-2023', value: 22 },
                      { month: 'Q2-2023', value: 17 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#2a9e31" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Источники рисков</CardTitle>
                <CardDescription>Распределение по типам рисков</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Законодательный', value: 40, color: '#2a9e31' },
                        { name: 'Операционный', value: 25, color: '#ff9800' },
                        { name: 'Финансовый', value: 15, color: '#f44336' },
                        { name: 'Репутационный', value: 20, color: '#9c27b0' },
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
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
                          ? 'bg-red-50' 
                          : task.risk === 'medium' 
                            ? 'bg-amber-50' 
                            : 'bg-emerald-50'
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
                        <button className="text-xs bg-white border border-border px-3 py-1 rounded hover:bg-muted">
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
      </Tabs>
    </div>
  );
}
