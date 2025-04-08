
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Cell,
  Area, AreaChart, TooltipProps
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RiskScenario } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowUpRight, ChevronDown, ChevronUp, HelpCircle, TrendingDown, TrendingUp } from 'lucide-react';
import { 
  NameType, ValueType 
} from 'recharts/types/component/DefaultTooltipContent';
import InteractiveTooltip from '../common/InteractiveTooltip';

// Sample data for the chart
const sampleScenarios: RiskScenario[] = [
  { id: '1', name: 'Нарушение требований по ПДн', probability: 0.7, impact: 8, category: 'Законодательство', description: 'Риск нарушения требований законодательства по защите персональных данных.' },
  { id: '2', name: 'Отказ критической системы', probability: 0.3, impact: 9, category: 'Техническая инфраструктура', description: 'Риск отказа критически важной системы, влияющей на непрерывность бизнеса.' },
  { id: '3', name: 'Кибератака', probability: 0.5, impact: 7, category: 'Информационная безопасность', description: 'Риск успешной кибератаки на информационные системы компании.' },
  { id: '4', name: 'Утечка конфиденциальной информации', probability: 0.4, impact: 8, category: 'Информационная безопасность', description: 'Риск утечки конфиденциальной корпоративной информации.' },
  { id: '5', name: 'Изменение законодательства', probability: 0.8, impact: 6, category: 'Законодательство', description: 'Риск внезапного изменения нормативных требований.' },
  { id: '6', name: 'Потеря ключевых сотрудников', probability: 0.3, impact: 5, category: 'Персонал', description: 'Риск ухода ключевых специалистов из компании.' },
];

// Calculate risk score
const calculateRiskScore = (probability: number, impact: number) => {
  return probability * impact;
};

// Process data to include risk score
const processedData = sampleScenarios.map(scenario => ({
  ...scenario,
  riskScore: calculateRiskScore(scenario.probability, impact),
  probabilityPercent: scenario.probability * 100,
  impact: scenario.impact
}));

// Sort data by risk score
const sortedData = [...processedData].sort((a, b) => b.riskScore - a.riskScore);

// Historical risk data for trending
const historicalData = [
  { month: 'Янв', legislationRisk: 5.2, techRisk: 3.8, infoSecRisk: 4.5, personnelRisk: 3.0 },
  { month: 'Фев', legislationRisk: 5.0, techRisk: 4.0, infoSecRisk: 4.8, personnelRisk: 3.2 },
  { month: 'Мар', legislationRisk: 5.5, techRisk: 3.6, infoSecRisk: 4.3, personnelRisk: 3.5 },
  { month: 'Апр', legislationRisk: 6.0, techRisk: 3.8, infoSecRisk: 4.7, personnelRisk: 3.3 },
  { month: 'Май', legislationRisk: 6.2, techRisk: 4.2, infoSecRisk: 5.0, personnelRisk: 3.1 },
  { month: 'Июн', legislationRisk: 6.8, techRisk: 4.5, infoSecRisk: 5.3, personnelRisk: 3.4 },
];

// Custom tooltip component for bar chart
const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as RiskScenario & { riskScore: number, probabilityPercent: number };
    
    return (
      <div className="bg-background border p-3 rounded-lg shadow-md text-sm max-w-xs">
        <p className="font-medium mb-1">{data.name}</p>
        <p className="text-muted-foreground mb-2">Категория: {data.category}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <p>Вероятность:</p>
          <p className="text-right font-medium">{data.probabilityPercent.toFixed(0)}%</p>
          <p>Влияние:</p>
          <p className="text-right font-medium">{data.impact}/10</p>
          <p>Риск-рейтинг:</p>
          <p className="text-right font-medium">{data.riskScore.toFixed(1)}</p>
        </div>
      </div>
    );
  }

  return null;
};

// Risk level color coding
const getRiskColor = (score: number) => {
  if (score < 3) return "#22c55e"; // low - green
  if (score < 5) return "#eab308"; // medium - yellow
  if (score < 7) return "#f97316"; // high - orange
  return "#ef4444"; // critical - red
};

const RiskImpactChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState('distribution');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<RiskScenario | null>(null);
  
  // Filter data based on selected category
  const filteredData = selectedCategory 
    ? sortedData.filter(item => item.category === selectedCategory)
    : sortedData;

  // Handle click on a bar to show details
  const handleBarClick = (data: any) => {
    setSelectedScenario(data);
  };

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  // Get unique categories
  const categories = Array.from(new Set(sampleScenarios.map(item => item.category)));

  // Calculate trend for a risk category
  const calculateTrend = (category: string) => {
    const currentIndex = historicalData.length - 1;
    if (currentIndex <= 0) return 0;
    
    let fieldName = '';
    switch(category) {
      case 'Законодательство': fieldName = 'legislationRisk'; break;
      case 'Техническая инфраструктура': fieldName = 'techRisk'; break;
      case 'Информационная безопасность': fieldName = 'infoSecRisk'; break;
      case 'Персонал': fieldName = 'personnelRisk'; break;
      default: return 0;
    }
    
    const currentValue = historicalData[currentIndex][fieldName as keyof typeof historicalData[0]] as number;
    const previousValue = historicalData[currentIndex - 1][fieldName as keyof typeof historicalData[0]] as number;
    
    return ((currentValue - previousValue) / previousValue) * 100;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Анализ рисков</CardTitle>
            <CardDescription>Распределение и динамика основных рисков</CardDescription>
          </div>
          <InteractiveTooltip
            content={
              <div>
                <p>Этот график показывает распределение рисков по категориям и их значимость.</p>
                <p className="mt-2">Можно кликнуть на категорию для фильтрации или на конкретный риск для детализации.</p>
              </div>
            }
          />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="distribution">Распределение рисков</TabsTrigger>
            <TabsTrigger value="trends">Динамика</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="p-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(category => (
                <Button 
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategorySelect(category)}
                  className="text-xs"
                >
                  {category}
                  <span className="ml-1 text-xs opacity-70">
                    ({sortedData.filter(item => item.category === category).length})
                  </span>
                </Button>
              ))}
            </div>
            
            <div className="h-64 md:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={filteredData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
                  barSize={32}
                  onClick={handleBarClick}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    interval={0}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis 
                    tick={{ fontSize: 11 }}
                    domain={[0, 10]}
                    label={{ 
                      value: 'Риск-рейтинг', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle', fontSize: 12 } 
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="riskScore" 
                    name="Риск-рейтинг" 
                    radius={[4, 4, 0, 0]}
                    cursor="pointer"
                  >
                    {filteredData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={getRiskColor(entry.riskScore)} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            {selectedScenario && (
              <div className="mt-4 p-4 border rounded-lg bg-background/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{selectedScenario.name}</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedScenario(null)}
                    className="h-7 w-7 p-0"
                  >
                    <ChevronUp size={16} />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{selectedScenario.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-2 border rounded">
                    <p className="text-xs text-muted-foreground">Категория</p>
                    <p className="font-medium">{selectedScenario.category}</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-xs text-muted-foreground">Вероятность</p>
                    <p className="font-medium">{(selectedScenario.probability * 100).toFixed(0)}%</p>
                  </div>
                  <div className="p-2 border rounded">
                    <p className="text-xs text-muted-foreground">Влияние</p>
                    <p className="font-medium">{selectedScenario.impact}/10</p>
                  </div>
                  <div className="p-2 border rounded bg-primary/10">
                    <p className="text-xs text-muted-foreground">Риск-рейтинг</p>
                    <p className="font-medium">{calculateRiskScore(selectedScenario.probability, selectedScenario.impact).toFixed(1)}</p>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button size="sm" className="gap-1">
                    Детальный анализ
                    <ArrowUpRight size={14} />
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="trends" className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {categories.map(category => {
                const trend = calculateTrend(category);
                const trendValue = trend.toFixed(1);
                const isPositive = trend < 0; // Lower risk is better
                
                return (
                  <div key={category} className="border rounded-lg p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{category}</h3>
                        <p className="text-sm text-muted-foreground">
                          {sortedData.filter(item => item.category === category).length} сценариев
                        </p>
                      </div>
                      <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {isPositive ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                        <span className="ml-1 text-sm font-medium">{isPositive ? trendValue : `+${trendValue}`}%</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={historicalData}
                          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id={`gradient-${category}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                          <YAxis hide domain={[0, 10]} />
                          <Area 
                            type="monotone" 
                            dataKey={
                              category === 'Законодательство' ? 'legislationRisk' : 
                              category === 'Техническая инфраструктура' ? 'techRisk' : 
                              category === 'Информационная безопасность' ? 'infoSecRisk' : 
                              'personnelRisk'
                            }
                            stroke="hsl(var(--primary))" 
                            fillOpacity={1}
                            fill={`url(#gradient-${category})`}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="mt-1 text-xs text-muted-foreground flex justify-end">
                      <Button variant="ghost" size="sm" className="h-auto p-1 gap-1">
                        Подробнее
                        <ChevronDown size={12} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 bg-muted/20 p-3 rounded-lg border flex gap-2 items-center">
              <AlertCircle size={16} className="text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Динамика рисков показывает изменение оценок риск-рейтинга за последние 6 месяцев
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RiskImpactChart;
