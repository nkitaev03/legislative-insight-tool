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

// Risk-focused data for business owner dashboard
const criticalRisks = [
  {
    title: "Нарушение ФЗ №149 по защите данных",
    impact: "3.4M₽",
    probability: 85,
    status: "critical",
    category: "Правовые",
    timeToRealize: "2-4 недели"
  },
  {
    title: "Отток ключевых клиентов",
    impact: "2.1M₽", 
    probability: 65,
    status: "high",
    category: "Коммерческие",
    timeToRealize: "1-3 месяца"
  },
  {
    title: "Кибер-атаки на IT-системы",
    impact: "1.8M₽",
    probability: 45,
    status: "medium",
    category: "Технологические",
    timeToRealize: "В любой момент"
  }
];

const priorityTasks = [
  {
    title: "Обновить IT-инфраструктуру",
    deadline: "15 дней",
    progress: 75,
    status: "on-track",
    riskReduction: "60%"
  },
  {
    title: "Аудит соответствия ФЗ-152", 
    deadline: "7 дней",
    progress: 30,
    status: "at-risk",
    riskReduction: "85%"
  },
  {
    title: "Внедрение модерации контента",
    deadline: "3 дня",
    progress: 90,
    status: "almost-done",
    riskReduction: "40%"
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
        <p className="text-muted-foreground">ООО «Звук» • Мониторинг рисков и соответствия</p>
      </div>

      {/* Risk Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-orange-200">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-orange-600/15"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
              <Badge variant="destructive" className="text-lg px-3 py-1 bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200">
                ВНИМАНИЕ
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Общий риск-профиль</p>
              <p className="text-4xl font-bold text-orange-600">7.3M₽</p>
              <p className="text-sm text-orange-600 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" />
                Потенциальный ущерб
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <Badge variant="secondary" className="bg-orange-50 text-orange-700 border-orange-200 text-lg px-3 py-1">
                3 активных
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Требуют решения</p>
              <p className="text-4xl font-bold">85%</p>
              <p className="text-sm text-muted-foreground">
                Вероятность реализации
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 text-lg px-3 py-1">
                В работе
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Мер по снижению</p>
              <p className="text-4xl font-bold">5/8</p>
              <p className="text-sm text-green-600">
                Реализуется сейчас
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Legislation and News Feed */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/30 border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Building className="w-5 h-5 text-blue-500" />
              — Я собрал важные изменения в законах и СМИ
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              Показать все
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border border-blue-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-1.5 bg-blue-100 rounded-md">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                    Законодательство
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 leading-tight">
                  Федеральный закон от 08.08.2024 № 216-ФЗ «О внесении изменений в ...»
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Закон направлен на усиление регулирования в сфере информационной безопасности и защиты данных
                </p>
                <Button size="sm" variant="outline" className="w-full text-blue-600 border-blue-200 hover:bg-blue-50">
                  Принять меры
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-green-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-1.5 bg-green-100 rounded-md">
                    <BarChart3 className="w-4 h-4 text-green-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                    Новость
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 leading-tight">
                  Магазин-склад Самоката закрыт Роспотребнадзором
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Невский районный суд Петербурга закрыл магазин-склад ООО "Умный Ритейл" в Ростове-на-Дону по иску Роспотребнадзор...
                </p>
                <Button size="sm" variant="outline" className="w-full text-green-600 border-green-200 hover:bg-green-50">
                  Принять меры
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-orange-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-1.5 bg-orange-100 rounded-md">
                    <Shield className="w-4 h-4 text-orange-600" />
                  </div>
                  <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700 border-orange-200">
                    Законодательство
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-2 leading-tight">
                  Ужесточение требований к обработке персональных данных
                </h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Ужесточились требования к обработке персональных данных и существенно выросли штрафы за выявленные нарушения.
                </p>
                <Button size="sm" variant="outline" className="w-full text-orange-600 border-orange-200 hover:bg-orange-50">
                  Принять меры
                  <ArrowUpRight className="w-3 h-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Critical Risks - Main Focus */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50/30 to-yellow-50/30 hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              Критические риски для принятия решений
            </CardTitle>
            <Badge variant="secondary" className="text-sm px-3 py-1 bg-orange-100 text-orange-700 border-orange-200">
              Требуют внимания
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {criticalRisks.map((risk, index) => (
            <div key={index} className="p-6 border-2 rounded-xl hover:bg-white/50 transition-all duration-300 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    risk.status === 'critical' ? 'bg-orange-500' :
                    risk.status === 'high' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div>
                    <h3 className="font-semibold text-lg">{risk.title}</h3>
                    <p className="text-sm text-muted-foreground">{risk.category} • {risk.timeToRealize}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Badge variant="secondary" className="text-lg px-3 py-1 bg-orange-100 text-orange-700 border-orange-200">
                    {risk.impact}
                  </Badge>
                  <p className="text-sm text-muted-foreground">потенциальный ущерб</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Вероятность реализации</span>
                    <span className="font-bold text-lg">{risk.probability}%</span>
                  </div>
                  <Progress value={risk.probability} className="h-3" />
                  <p className="text-xs text-muted-foreground">
                    {risk.probability > 70 ? 'Очень высокая' : risk.probability > 50 ? 'Высокая' : 'Средняя'}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <span className="text-sm font-medium">Статус решения</span>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                      Принять меры
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      Подробнее
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Risk Management Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Priority Actions */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Приоритетные меры
            </CardTitle>
            <CardDescription>Действия для снижения рисков</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {priorityTasks.map((task, index) => (
              <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-medium text-sm leading-tight">{task.title}</h4>
                    <p className="text-xs text-green-600 mt-1">Снижение риска на {task.riskReduction}</p>
                  </div>
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
            <Button className="w-full mt-4">
              Управление мерами
              <ArrowUpRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>

        {/* Financial Impact */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Финансовое влияние рисков
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
                <span className="font-medium">Максимальный ущерб</span>
                <span className="text-2xl font-bold text-red-600">7.3M₽</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-orange-50 rounded-lg">
                <span className="font-medium">Ожидаемый ущерб</span>
                <span className="text-xl font-bold text-orange-600">4.2M₽</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="font-medium">Экономия от мер</span>
                <span className="text-xl font-bold text-green-600">2.8M₽</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">ROI от управления рисками</span>
                <span className="font-bold text-green-600">+67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Risk Assistant */}
      <Card className="bg-gradient-to-r from-blue-500/5 to-purple-500/10 border-blue-200 hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <img 
                src="/lovable-uploads/baced79b-ef78-45d4-ae84-b842ec73b605.png" 
                alt="AI Assistant" 
                className="w-8 h-8"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2 text-blue-600">Рекомендации NORM AI</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                На основе анализа новых требований ФЗ №149 рекомендую: <strong>запланировать аудит соответствия на следующую неделю</strong>. 
                Это поможет избежать потенциальных штрафов до 3.4M₽ и снизит общий риск-профиль на 60%. 
                Также стоит ускорить внедрение системы модерации контента.
              </p>
              <div className="flex gap-3">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Применить рекомендации
                </Button>
                <Button size="sm" variant="outline">
                  Анализ сценариев
                </Button>
                <Button size="sm" variant="ghost">
                  Детальный отчет
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}