import { useState } from 'react';
import {
  BarChart3,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Percent,
  ArrowUpRight,
  Calendar,
  Target,
  Shield,
  Users,
  Building
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import MetricCard from '../common/MetricCard';
import { 
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

// Simplified data for business owner dashboard
const kpiData = [
  { month: 'Янв', revenue: 120, profit: 24 },
  { month: 'Фев', revenue: 135, profit: 28 },
  { month: 'Мар', revenue: 148, profit: 32 },
  { month: 'Апр', revenue: 156, profit: 35 },
  { month: 'Май', revenue: 162, profit: 38 },
  { month: 'Июн', revenue: 178, profit: 42 }
];

const criticalRisks = [
  {
    title: "Нарушение ФЗ №149 по защите данных",
    impact: "3.4M₽",
    probability: 85,
    status: "critical"
  },
  {
    title: "Отток ключевых клиентов",
    impact: "2.1M₽", 
    probability: 65,
    status: "high"
  },
  {
    title: "Кибер-атаки на IT-системы",
    impact: "1.8M₽",
    probability: 45,
    status: "medium"
  }
];

const priorityTasks = [
  {
    title: "Обновить IT-инфраструктуру",
    deadline: "15 дней",
    progress: 75,
    status: "on-track"
  },
  {
    title: "Аудит соответствия ФЗ-152", 
    deadline: "7 дней",
    progress: 30,
    status: "at-risk"
  },
  {
    title: "Внедрение модерации контента",
    deadline: "3 дня",
    progress: 90,
    status: "almost-done"
  }
];

export default function DashboardPage() {
  const [timeframe, setTimeframe] = useState('current');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Панель руководителя
        </h1>
        <p className="text-muted-foreground">ООО «Звук» • Краткий обзор ключевых показателей</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                +18% к плану
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Выручка (полугодие)</p>
              <p className="text-3xl font-bold">178M₽</p>
              <p className="text-sm text-green-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                План: 150M₽
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Percent className="w-6 h-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                Стабильно
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Рентабельность</p>
              <p className="text-3xl font-bold">23.6%</p>
              <p className="text-sm text-muted-foreground">
                Средняя по рынку: 18%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <Badge variant="destructive">
                Требует внимания
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Критические риски</p>
              <p className="text-3xl font-bold text-orange-600">7.3M₽</p>
              <p className="text-sm text-orange-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Потенциальный ущерб
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                72% готово
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Критические задачи</p>
              <p className="text-3xl font-bold">8/11</p>
              <p className="text-sm text-muted-foreground">
                Выполнено в срок
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Динамика роста
            </CardTitle>
            <CardDescription>
              Выручка и прибыль за 6 месяцев (млн ₽)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpiData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `${value}M`} />
                  <Tooltip 
                    formatter={(value, name) => [
                      `${value}M₽`, 
                      name === 'revenue' ? 'Выручка' : 'Прибыль'
                    ]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fill="url(#colorRevenue)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="profit" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    fill="url(#colorProfit)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-primary" />
              Быстрая сводка
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Команда</span>
                <span className="font-semibold">247 сотрудников</span>
              </div>
              <Progress value={85} className="h-2" />
              <p className="text-xs text-muted-foreground">Эффективность: 85%</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Клиенты</span>
                <span className="font-semibold">12,847 активных</span>
              </div>
              <Progress value={92} className="h-2" />
              <p className="text-xs text-muted-foreground">Удержание: 92%</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Соответствие</span>
                <span className="font-semibold text-orange-600">68%</span>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-orange-600">Требует внимания</p>
            </div>

            <Button className="w-full" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Подробная аналитика
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Critical Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Risks */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-500" />
                Критические риски
              </div>
              <Badge variant="destructive" className="text-xs">
                Топ-3
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {criticalRisks.map((risk, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm leading-tight">{risk.title}</h4>
                  <Badge variant={risk.status === 'critical' ? 'destructive' : 
                                risk.status === 'high' ? 'destructive' : 'secondary'} 
                         className="text-xs">
                    {risk.impact}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Вероятность</span>
                    <span className="font-medium">{risk.probability}%</span>
                  </div>
                  <Progress value={risk.probability} className="h-2" />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4">
              Перейти к рискам
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Priority Tasks */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Приоритетные задачи
              </div>
              <Badge variant="secondary" className="text-xs">
                На контроле
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorityTasks.map((task, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                  <Badge variant={task.status === 'at-risk' ? 'destructive' : 
                                task.status === 'almost-done' ? 'default' : 'secondary'} 
                         className="text-xs">
                    {task.deadline}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Готовность</span>
                    <span className="font-medium">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full mt-4">
              Управление задачами
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <img 
                src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                alt="AI Assistant" 
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-primary">Рекомендации NORM AI</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                На основе анализа показателей рекомендую: <strong>срочно завершить аудит соответствия ФЗ-152</strong> 
                — просрочка может привести к штрафам до 3M₽. Также стоит ускорить внедрение модерации контента, 
                это снизит юридические риски на 40%.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  Применить рекомендации
                </Button>
                <Button size="sm" variant="outline">
                  Подробный анализ
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}