
import React, { useState } from 'react';
import { AlertTriangle, Check, Info, FileText, ChevronRight, ShieldAlert, BarChart4, PieChart, Gauge, Clock, Target, Zap, Shield } from 'lucide-react';
import RiskIndicator from '@/components/common/RiskIndicator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  PieChart as ReChartsPie, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Tooltip,
  RadialBarChart,
  RadialBar 
} from 'recharts';

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  mitigation: string;
}

interface Action {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  assignedTo?: string;
}

interface RiskAnalysisCardProps {
  title: string;
  score: number;
  scoreLabel: string;
  description: string;
  risks: Risk[];
  actions: Action[];
  className?: string;
}

export default function RiskAnalysisCard({
  title,
  score,
  scoreLabel,
  description,
  risks,
  actions,
  className
}: RiskAnalysisCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Group risks by category
  const getRisksByCategory = () => {
    const categories: Record<string, Risk[]> = {};
    
    risks.forEach(risk => {
      if (!categories[risk.category]) {
        categories[risk.category] = [];
      }
      categories[risk.category].push(risk);
    });
    
    return categories;
  };
  
  const risksByCategory = getRisksByCategory();
  
  // Calculate risks distribution by impact
  const getRisksDistribution = () => {
    const distribution = {
      high: risks.filter(r => r.impact === 'high').length,
      medium: risks.filter(r => r.impact === 'medium').length,
      low: risks.filter(r => r.impact === 'low').length
    };
    
    const total = risks.length;
    
    return [
      { name: 'Высокий', value: distribution.high, percentage: Math.round((distribution.high / total) * 100), color: '#ef4444' },
      { name: 'Средний', value: distribution.medium, percentage: Math.round((distribution.medium / total) * 100), color: '#f59e0b' },
      { name: 'Низкий', value: distribution.low, percentage: Math.round((distribution.low / total) * 100), color: '#10b981' }
    ];
  };
  
  const risksDistribution = getRisksDistribution();
  
  // Calculate actions status distribution
  const getActionsDistribution = () => {
    const distribution = {
      completed: actions.filter(a => a.status === 'completed').length,
      inProgress: actions.filter(a => a.status === 'in-progress').length,
      pending: actions.filter(a => a.status === 'pending').length
    };
    
    const total = actions.length;
    
    return [
      { name: 'Выполнено', value: distribution.completed, percentage: Math.round((distribution.completed / total) * 100), color: '#10b981' },
      { name: 'В процессе', value: distribution.inProgress, percentage: Math.round((distribution.inProgress / total) * 100), color: '#f59e0b' },
      { name: 'Ожидает', value: distribution.pending, percentage: Math.round((distribution.pending / total) * 100), color: '#d1d5db' }
    ];
  };
  
  const actionsDistribution = getActionsDistribution();
  
  // Get risk level and visual elements based on score
  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 75) return 'low';
    if (score >= 60) return 'medium';
    return 'high';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 75) return 'bg-compGreen-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  
  const getScoreTextColor = (score: number): string => {
    if (score >= 75) return 'text-compGreen-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-red-500';
  };
  
  // Prepare data for radial gauge
  const gaugeData = [
    {
      name: 'Индекс соответствия',
      value: score,
      fill: score >= 75 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444')
    }
  ];

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow overflow-hidden ${className}`}>
        <CardHeader className="pb-2 relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                {title}
              </CardTitle>
              <CardDescription>{scoreLabel}</CardDescription>
            </div>
            <div className={`h-16 w-16 relative`}>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className={`text-xl font-bold ${getScoreTextColor(score)}`}>{score}%</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                  innerRadius="65%" 
                  outerRadius="100%" 
                  barSize={8} 
                  data={gaugeData}
                  startAngle={180}
                  endAngle={-180}
                >
                  <RadialBar
                    background={{ fill: '#f3f4f6' }}
                    dataKey="value"
                    cornerRadius={10}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="flex mt-2">
            <div className="flex-1 pr-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <span>Риски: {risks.length}</span>
              </div>
              <Progress 
                value={risksDistribution[2].percentage + risksDistribution[1].percentage / 2} 
                className="h-2" 
                // Uses regular className for the indicator since indicatorClassName is not supported
                // We'll use the default indicator styling instead
              />
            </div>
            <div className="flex-1 pl-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Check className="h-3 w-3 text-compGreen-500" />
                <span>Действия: {actionsDistribution[0].percentage}% выполнено</span>
              </div>
              <Progress value={actionsDistribution[0].percentage} className="h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4 pb-3">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>
          
          <div className="flex flex-wrap -mx-2">
            <div className="w-1/3 px-2">
              <div className={`p-3 rounded-lg bg-${getRiskLevel(score)}-50 text-center`}>
                <div className="text-2xl font-semibold mb-1">{risks.filter(r => r.impact === 'high').length}</div>
                <div className="text-xs text-muted-foreground">Высоких рисков</div>
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div className="p-3 rounded-lg bg-blue-50 text-center">
                <div className="text-2xl font-semibold mb-1">{Object.keys(risksByCategory).length}</div>
                <div className="text-xs text-muted-foreground">Категорий</div>
              </div>
            </div>
            <div className="w-1/3 px-2">
              <div className="p-3 rounded-lg bg-compGreen-50 text-center">
                <div className="text-2xl font-semibold mb-1">{actions.filter(a => a.status === 'completed').length}</div>
                <div className="text-xs text-muted-foreground">Выполненных</div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => setIsDetailsOpen(true)}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            Подробный анализ
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center text-xl">
              <Shield className="h-5 w-5 mr-2 text-muted-foreground" />
              {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid grid-cols-3 w-full mb-4">
              <TabsTrigger value="overview">
                <Gauge className="h-4 w-4 mr-2" />
                Общая картина
              </TabsTrigger>
              <TabsTrigger value="risks">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Риски
              </TabsTrigger>
              <TabsTrigger value="actions">
                <Zap className="h-4 w-4 mr-2" />
                Действия
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Compliance Score */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      Индекс соответствия
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[200px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart 
                          innerRadius="30%"
                          outerRadius="100%"
                          barSize={20}
                          data={gaugeData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            background={{ fill: '#f3f4f6' }}
                            dataKey="value"
                            cornerRadius={10}
                            label={{ 
                              position: 'center',
                              fill: score >= 75 ? '#10b981' : (score >= 60 ? '#f59e0b' : '#ef4444'),
                              fontSize: 32,
                              fontWeight: 'bold',
                              formatter: (value: number) => `${value}%` 
                            }}
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="text-center mt-2">
                      <div className={`text-sm font-medium ${getScoreTextColor(score)}`}>
                        {score >= 75 ? 'Высокий уровень соответствия' : 
                         score >= 60 ? 'Средний уровень соответствия' : 
                         'Низкий уровень соответствия'}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {score >= 75 ? 'Отличная защищенность от рисков' : 
                         score >= 60 ? 'Требуется внимание к некоторым рискам' : 
                         'Требуются срочные меры по снижению рисков'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-muted-foreground" />
                      Распределение рисков
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <ReChartsPie>
                          <Pie
                            data={risksDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={40}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {risksDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </ReChartsPie>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-2">
                      {risksDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-1.5 text-sm">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                          <span className="text-xs">{item.name}: {item.value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Actions Status */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <BarChart4 className="h-4 w-4 text-muted-foreground" />
                      Статус действий
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="h-[200px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={actionsDistribution}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                          <YAxis type="category" dataKey="name" width={80} />
                          <Tooltip 
                            formatter={(value) => [`${value}%`, 'Процент']}
                            labelFormatter={(name) => `Статус: ${name}`}
                          />
                          <Bar 
                            dataKey="percentage" 
                            barSize={20} 
                            radius={[0, 4, 4, 0]}
                          >
                            {actionsDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 text-center text-xs text-muted-foreground">
                      {actionsDistribution[0].percentage >= 75 ? 
                        'Отличный прогресс по снижению рисков' : 
                        actionsDistribution[0].percentage >= 50 ?
                        'Хороший прогресс, продолжайте выполнять действия' :
                        'Требуется ускорить выполнение действий по снижению рисков'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Categories Chart */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Распределение рисков по категориям</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.entries(risksByCategory).map(([category, risks]) => ({
                          category,
                          high: risks.filter(r => r.impact === 'high').length,
                          medium: risks.filter(r => r.impact === 'medium').length,
                          low: risks.filter(r => r.impact === 'low').length,
                          total: risks.length
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="category" 
                          angle={-45} 
                          textAnchor="end" 
                          height={70} 
                          interval={0}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="high" name="Высокий" stackId="a" fill="#ef4444" />
                        <Bar dataKey="medium" name="Средний" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="low" name="Низкий" stackId="a" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              {/* Categorized Risks */}
              {Object.entries(risksByCategory).map(([category, categoryRisks]) => (
                <Card key={category}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category}</CardTitle>
                    <CardDescription>
                      {categoryRisks.length} {categoryRisks.length === 1 ? 'риск' : 
                      categoryRisks.length > 1 && categoryRisks.length < 5 ? 'риска' : 'рисков'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryRisks.map((risk) => (
                        <div key={risk.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                          <div className="flex justify-between items-start">
                            <h4 className="text-md font-medium flex items-start">
                              <RiskIndicator level={risk.impact} size="sm" className="mt-1 mr-2" />
                              {risk.title}
                            </h4>
                          </div>
                          <p className="mt-2 text-sm text-muted-foreground">{risk.description}</p>
                          <div className="mt-3 pt-3 border-t">
                            <h5 className="text-sm font-medium mb-2 flex items-center">
                              <Shield className="h-4 w-4 mr-1 text-indigo-500" />
                              Рекомендации по снижению:
                            </h5>
                            <p className="text-sm text-muted-foreground">{risk.mitigation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="actions" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="bg-compGreen-50 border-compGreen-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-compGreen-700 flex items-center gap-2">
                      <Check className="h-5 w-5" />
                      Выполненные
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-compGreen-600 mb-1">
                      {actions.filter(a => a.status === 'completed').length}
                    </div>
                    <div className="text-sm text-compGreen-600">
                      {Math.round((actions.filter(a => a.status === 'completed').length / actions.length) * 100)}% от всех действий
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-amber-700 flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      В процессе
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-600 mb-1">
                      {actions.filter(a => a.status === 'in-progress').length}
                    </div>
                    <div className="text-sm text-amber-600">
                      {Math.round((actions.filter(a => a.status === 'in-progress').length / actions.length) * 100)}% от всех действий
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-gray-700 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Ожидают
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-600 mb-1">
                      {actions.filter(a => a.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-600">
                      {Math.round((actions.filter(a => a.status === 'pending').length / actions.length) * 100)}% от всех действий
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Items */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">План действий</CardTitle>
                  <CardDescription>
                    Рекомендуемые меры по снижению рисков
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {actions.map((action) => (
                      <div 
                        key={action.id} 
                        className={`flex items-start p-4 rounded-lg border ${
                          action.status === 'completed' ? 'bg-compGreen-50 border-compGreen-200' : 
                          action.status === 'in-progress' ? 'bg-amber-50 border-amber-200' : 
                          'bg-white'
                        }`}
                      >
                        <div className="mr-3 mt-1">
                          {action.status === 'completed' ? (
                            <div className="h-6 w-6 rounded-full bg-compGreen-500 flex items-center justify-center">
                              <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                          ) : action.status === 'in-progress' ? (
                            <div className="h-6 w-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                          ) : (
                            <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium">{action.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                          {(action.dueDate || action.assignedTo) && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {action.dueDate && (
                                <span className="text-xs bg-background px-2 py-0.5 rounded-full border border-border inline-flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Срок: {action.dueDate}
                                </span>
                              )}
                              {action.assignedTo && (
                                <span className="text-xs bg-background px-2 py-0.5 rounded-full border border-border inline-flex items-center">
                                  <Info className="h-3 w-3 mr-1" />
                                  Ответственный: {action.assignedTo}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="ml-2">
                          {action.status === 'completed' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-compGreen-100 text-compGreen-800">
                              Выполнено
                            </span>
                          ) : action.status === 'in-progress' ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                              В процессе
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              Ожидает
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDetailsOpen(false)} 
              className="flex-1 sm:flex-none"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
