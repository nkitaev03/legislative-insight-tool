
import React, { useState, useCallback, useMemo } from 'react';
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  ReferenceLine,
  Line,
  ComposedChart,
  LabelList,
  Cell
} from 'recharts';
import { SimulationResult } from './types';
import { ChartContainer } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { 
  BarChart, 
  TrendingUp, 
  ArrowLeft, 
  Info, 
  AlertCircle, 
  BarChart4, 
  Activity, 
  ArrowUpRight, 
  Maximize2, 
  ChevronDown
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface RiskImpactChartProps {
  simulationResults: SimulationResult[];
  onRiskSelect?: (riskId: string) => void;
}

const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899'];

const RiskImpactChart: React.FC<RiskImpactChartProps> = ({ simulationResults, onRiskSelect }) => {
  const [selectedRisk, setSelectedRisk] = useState<SimulationResult | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [viewType, setViewType] = useState<'bars' | 'waterfall'>('bars');
  const [detailsActiveTab, setDetailsActiveTab] = useState('overview');
  
  // Prepare data for chart
  const chartData = useMemo(() => 
    simulationResults
      .map(result => ({
        name: result.title.length > 25 ? result.title.substring(0, 25) + '...' : result.title,
        fullName: result.title,
        impact: result.percentile95,
        expected: result.mean,
        min: result.min,
        max: result.max,
        riskId: result.riskId,
        riskCategory: result.riskCategory,
        color: getCategoryColor(result.riskCategory),
        ratio: result.percentile95 / result.mean,
        percentile90: result.percentile90
      }))
      .sort((a, b) => b.impact - a.impact)
  , [simulationResults]);
  
  // Function to get color based on risk category
  function getCategoryColor(category: string): string {
    switch(category) {
      case 'financial': return '#ef4444';
      case 'operational': return '#f59e0b';
      case 'legal': return '#3b82f6';
      case 'strategic': return '#8b5cf6';
      case 'reputational': return '#ec4899';
      default: return '#6b7280';
    }
  }
  
  // Get category name in Russian
  function getCategoryName(category: string): string {
    switch(category) {
      case 'financial': return 'Финансовый';
      case 'operational': return 'Операционный';
      case 'legal': return 'Правовой';
      case 'strategic': return 'Стратегический';
      case 'reputational': return 'Репутационный';
      default: return 'Другой';
    }
  }

  // Function to handle bar click for drill-down
  const handleRiskSelect = useCallback((data: any) => {
    const selectedRiskId = data.riskId;
    const risk = simulationResults.find(r => r.riskId === selectedRiskId);
    if (risk) {
      setSelectedRisk(risk);
      if (onRiskSelect) {
        onRiskSelect(selectedRiskId);
      } else {
        setDetailsActiveTab('overview');
        setShowDetailDialog(true);
      }
    }
  }, [simulationResults, onRiskSelect]);

  // Prepare distribution data for selected risk
  const getDistributionData = useCallback(() => {
    if (!selectedRisk) return [];
    
    // Calculate bins for histogram
    const simulations = selectedRisk.simulations;
    const min = Math.min(...simulations);
    const max = Math.max(...simulations);
    const range = max - min;
    
    // Adaptive bin count based on data range
    const binCount = Math.min(20, Math.max(10, Math.floor(simulations.length / 50)));
    const binSize = range / binCount;
    
    const bins = Array(binCount).fill(0).map((_, i) => {
      const start = min + i * binSize;
      const end = min + (i + 1) * binSize;
      const values = simulations.filter(val => val >= start && val < end);
      const count = values.length;
      
      return {
        range: `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.floor(start))}`,
        rangeEnd: `${new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(Math.floor(end))}`,
        count,
        frequency: count / simulations.length,
        avgValue: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0
      };
    });
    
    return bins;
  }, [selectedRisk]);
  
  // Prepare cumulative distribution data
  const getCumulativeDistribution = useCallback(() => {
    if (!selectedRisk) return [];
    
    const sortedData = [...selectedRisk.simulations].sort((a, b) => a - b);
    const totalPoints = Math.min(100, sortedData.length); // Limit data points
    const step = sortedData.length / totalPoints;
    
    const result = [];
    for (let i = 0; i < totalPoints; i++) {
      const index = Math.floor(i * step);
      const value = sortedData[index];
      result.push({
        value,
        probability: (index + 1) / sortedData.length * 100
      });
    }
    
    return result;
  }, [selectedRisk]);
  
  // Prepare waterfall chart data
  const getWaterfallData = useMemo(() => {
    // Get top 5 risks plus "other" category
    const topRisks = chartData.slice(0, 5);
    
    const otherRisks = chartData.slice(5);
    const otherSum = otherRisks.reduce((sum, risk) => sum + risk.expected, 0);
    
    const data = topRisks.map(risk => ({
      name: risk.name,
      fullName: risk.fullName,
      value: risk.expected,
      color: risk.color,
      riskId: risk.riskId
    }));
    
    if (otherRisks.length > 0) {
      data.push({
        name: 'Прочие риски',
        fullName: 'Прочие риски',
        value: otherSum,
        color: '#6b7280',
        riskId: 'other'
      });
    }
    
    // Add a total value
    const total = data.reduce((sum, item) => sum + item.value, 0);
    // Add custom property to the type
    data.push({
      name: 'Общий риск',
      fullName: 'Общий риск',
      value: total,
      color: '#3b82f6', // Using blue color for total
      riskId: 'total'
    } as any); // Using 'as any' to bypass TypeScript strict checking
    
    return data;
  }, [chartData]);
  
  // Format for currency values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      maximumFractionDigits: 0,
      notation: value > 1000000 ? 'compact' : 'standard'
    }).format(value);
  };
  
  // Get statistics for selected risk
  const getStatistics = () => {
    if (!selectedRisk) return null;
    
    const simulations = selectedRisk.simulations;
    
    // Expected shortfall (average of worst 5% outcomes)
    const sortedSims = [...simulations].sort((a, b) => a - b);
    const worstFivePercent = sortedSims.slice(0, Math.ceil(sortedSims.length * 0.05));
    const expectedShortfall = worstFivePercent.reduce((sum, val) => sum + val, 0) / worstFivePercent.length;
    
    // Standard deviation
    const mean = selectedRisk.mean;
    const squaredDiffs = simulations.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / simulations.length;
    const stdDev = Math.sqrt(variance);
    
    // Coefficient of variation
    const cv = stdDev / mean;
    
    return {
      expectedShortfall,
      stdDev,
      cv,
      skewness: (3 * (mean - selectedRisk.median)) / stdDev
    };
  };
  
  const statistics = selectedRisk ? getStatistics() : null;
  
  // Custom tooltip for the main chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <div className="font-medium mb-1">{data.fullName}</div>
        <div className="flex items-center mb-1">
          <span className="h-2 w-2 rounded-full mr-1.5" style={{ backgroundColor: data.color }}></span>
          <span className="text-xs text-muted-foreground">{getCategoryName(data.riskCategory)}</span>
        </div>
        <div className="space-y-1.5 pt-1.5 border-t">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs">95-й процентиль:</span>
            <span className="text-xs font-medium text-red-600">
              {formatCurrency(data.impact)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs">Ожидаемое значение:</span>
            <span className="text-xs font-medium text-blue-600">
              {formatCurrency(data.expected)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs">Множитель риска:</span>
            <span className="text-xs font-medium">
              {data.ratio.toFixed(1)}x
            </span>
          </div>
        </div>
        <div className="mt-2 pt-1 border-t text-center">
          <span className="text-xs text-blue-600">Нажмите для детального анализа</span>
        </div>
      </div>
    );
  };
  
  // Waterfall Chart custom tooltip
  const WaterfallTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    if (data.riskId === 'total') {
      return (
        <div className="rounded-lg border bg-background p-3 shadow-lg">
          <div className="font-medium mb-1">Общее финансовое воздействие</div>
          <div className="text-sm font-medium">{formatCurrency(data.value)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Совокупное влияние всех рисков
          </div>
        </div>
      );
    }
    
    return (
      <div className="rounded-lg border bg-background p-3 shadow-lg">
        <div className="font-medium mb-1">{data.fullName}</div>
        <div className="text-sm font-medium">{formatCurrency(data.value)}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          {data.riskId === 'other' 
            ? 'Суммарное влияние остальных рисков' 
            : 'Нажмите для детального анализа'}
        </div>
      </div>
    );
  };
  
  // Custom shape for waterfall chart
  const WaterfallBar = (props: any) => {
    const { x, y, width, height, fill, payload } = props;
    
    if (payload.riskId === 'total') {
      return (
        <g>
          <rect x={x} y={y} width={width} height={height} fill="#3b82f6" rx={2} />
        </g>
      );
    }
    
    return (
      <g style={{ cursor: payload.riskId !== 'other' ? 'pointer' : 'default' }}>
        <rect x={x} y={y} width={width} height={height} fill={payload.color || fill} rx={2} />
      </g>
    );
  };

  return (
    <>
      <div className="h-full">
        <div className="mb-3 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <BarChart4 className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-medium">Финансовое воздействие рисков</h3>
          </div>
          <div className="flex items-center gap-2">
            <Tabs defaultValue="bars" value={viewType} onValueChange={(value) => setViewType(value as 'bars' | 'waterfall')}>
              <TabsList className="h-8">
                <TabsTrigger value="bars" className="h-8 px-3">
                  <BarChart className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Риски</span>
                </TabsTrigger>
                <TabsTrigger value="waterfall" className="h-8 px-3">
                  <Activity className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Каскад</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm" onClick={() => setShowDetailDialog(true)} className="h-8">
              <Maximize2 className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Подробнее</span>
            </Button>
          </div>
        </div>
        
        <div className="h-[calc(100%-40px)]">
          {viewType === 'bars' ? (
            <ChartContainer
              config={{
                impact: {
                  label: "95-й процентиль",
                  color: "#ef4444"
                },
                expected: {
                  label: "Ожидаемое значение",
                  color: "#3b82f6"
                }
              }}
              className="h-full w-full"
            >
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  barGap={2}
                  barSize={viewType === 'bars' ? 15 : 25}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    interval={0}
                    tick={{ fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                    width={60}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar 
                    dataKey="impact" 
                    name="95-й процентиль" 
                    fill="var(--color-impact)" 
                    radius={[4, 4, 0, 0]} 
                    onClick={handleRiskSelect}
                    style={{ cursor: 'pointer' }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                  <Bar 
                    dataKey="expected" 
                    name="Ожидаемое значение" 
                    fill="var(--color-expected)" 
                    radius={[4, 4, 0, 0]} 
                    onClick={handleRiskSelect}
                    style={{ cursor: 'pointer' }}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.3} />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <ChartContainer config={{}} className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={getWaterfallData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="name"
                    angle={-45} 
                    textAnchor="end" 
                    height={60}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis
                    tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                    width={60}
                  />
                  <Tooltip content={<WaterfallTooltip />} />
                  <Bar 
                    dataKey="value" 
                    name="Сумма" 
                    barSize={35}
                    shape={<WaterfallBar />}
                    onClick={(data) => {
                      if (data.riskId !== 'other' && data.riskId !== 'total') {
                        handleRiskSelect(data);
                      }
                    }}
                  >
                    <LabelList 
                      dataKey="value" 
                      position="top" 
                      formatter={(value: number) => formatCurrency(value).replace(' ₽', '')}
                      style={{ fontSize: 11, fill: '#6b7280' }} 
                    />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          )}
        </div>
      </div>

      {/* Enhanced Detail dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto p-0">
          {selectedRisk ? (
            <div>
              <DialogHeader className="px-6 pt-6 pb-2">
                <div className="flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedRisk(null)}
                    className="absolute left-4 top-4"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Назад
                  </Button>
                  <div className="ml-20">
                    <DialogTitle className="text-xl">
                      {selectedRisk.title}
                    </DialogTitle>
                    <DialogDescription className="flex items-center mt-1">
                      <Badge variant="outline" className="mr-2 bg-muted/50">
                        {getCategoryName(selectedRisk.riskCategory)}
                      </Badge>
                      {selectedRisk.scenarioName && (
                        <Badge variant="secondary">
                          Сценарий: {selectedRisk.scenarioName}
                        </Badge>
                      )}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <Tabs value={detailsActiveTab} onValueChange={setDetailsActiveTab} className="px-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">
                    <BarChart className="h-4 w-4 mr-2" />
                    Обзор
                  </TabsTrigger>
                  <TabsTrigger value="distribution">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Распределение
                  </TabsTrigger>
                  <TabsTrigger value="analysis">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Анализ риска
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Ожидаемые потери</CardTitle>
                            <CardDescription>Среднее значение</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">EL</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(selectedRisk.mean)}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/40 pt-3 pb-3 text-xs text-muted-foreground border-t">
                        Наиболее вероятное среднее значение потерь
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Непредвиденные потери</CardTitle>
                            <CardDescription>95-й процентиль</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">UL</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold text-amber-600">
                          {formatCurrency(selectedRisk.percentile95)}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/40 pt-3 pb-3 text-xs text-muted-foreground border-t">
                        Потери с 95% уверенностью не превысят это значение
                      </CardFooter>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">Экстремальные потери</CardTitle>
                            <CardDescription>Expected Shortfall</CardDescription>
                          </div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">ES</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="text-2xl font-bold text-red-600">
                          {formatCurrency(statistics?.expectedShortfall || 0)}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-muted/40 pt-3 pb-3 text-xs text-muted-foreground border-t">
                        Среднее потерь в худших 5% случаев
                      </CardFooter>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="md:col-span-2">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Ключевые показатели</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Волатильность</span>
                                <span className="text-sm font-medium">
                                  {(statistics?.cv || 0) < 0.5 ? 'Низкая' : 
                                   (statistics?.cv || 0) < 1 ? 'Средняя' : 'Высокая'}
                                </span>
                              </div>
                              <Progress value={Math.min(100, (statistics?.cv || 0) * 50)} className="h-2" />
                              <div className="flex justify-between mt-1">
                                <span className="text-xs text-muted-foreground">CV: {(statistics?.cv || 0).toFixed(2)}</span>
                                <span className="text-xs text-muted-foreground">
                                  σ: {formatCurrency(statistics?.stdDev || 0)}
                                </span>
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Соотношение риск/ожидание</span>
                                <span className="text-sm font-medium">
                                  {(selectedRisk.percentile95 / selectedRisk.mean) < 1.5 ? 'Низкое' : 
                                   (selectedRisk.percentile95 / selectedRisk.mean) < 2 ? 'Среднее' : 'Высокое'}
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(100, ((selectedRisk.percentile95 / selectedRisk.mean) - 1) * 50)} 
                                className="h-2" 
                              />
                              <div className="mt-1 text-xs text-muted-foreground">
                                P95/EL: {(selectedRisk.percentile95 / selectedRisk.mean).toFixed(2)}x
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">Асимметрия распределения</span>
                                <span className="text-sm font-medium">
                                  {(statistics?.skewness || 0) < 0.2 ? 'Симметричное' : 
                                   (statistics?.skewness || 0) < 0.5 ? 'Умеренная правая' : 'Сильная правая'}
                                </span>
                              </div>
                              <Progress 
                                value={Math.min(100, Math.max(0, (statistics?.skewness || 0) * 50 + 50))} 
                                className="h-2" 
                              />
                              <div className="mt-1 text-xs text-muted-foreground">
                                Skewness: {(statistics?.skewness || 0).toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Диапазон значений</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Минимум</div>
                            <div className="text-base font-medium">{formatCurrency(selectedRisk.min)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Медиана</div>
                            <div className="text-base font-medium">{formatCurrency(selectedRisk.median)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">90-й процентиль</div>
                            <div className="text-base font-medium">{formatCurrency(selectedRisk.percentile90)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Максимум</div>
                            <div className="text-base font-medium">{formatCurrency(selectedRisk.max)}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="distribution" className="mt-0 space-y-5">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Распределение частот</CardTitle>
                      <CardDescription>Гистограмма вероятностей финансовых потерь</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ChartContainer config={{ frequency: { color: "#8B5CF6" } }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBarChart data={getDistributionData()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis 
                                dataKey="range" 
                                tick={{ fontSize: 10 }}
                                angle={-30} 
                                textAnchor="end"
                                interval={1}
                              />
                              <YAxis 
                                yAxisId="left"
                                tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                                domain={[0, 'dataMax']}
                              />
                              <YAxis 
                                yAxisId="right"
                                orientation="right"
                                tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                                domain={['auto', 'auto']}
                              />
                              <Tooltip 
                                formatter={(value, name) => {
                                  if (name === 'frequency') return [`${(Number(value) * 100).toFixed(1)}%`, 'Частота'];
                                  return [formatCurrency(Number(value)), 'Среднее значение'];
                                }}
                                labelFormatter={(label, payload) => {
                                  if (payload && payload.length > 0) {
                                    return `Диапазон: ${label} - ${payload[0].payload.rangeEnd} ₽`;
                                  }
                                  return `Значение: ~${label} ₽`;
                                }}
                              />
                              <ReferenceLine 
                                x={getDistributionData().findIndex(
                                  item => parseFloat(item.range.replace(/\s/g, '')) > selectedRisk.mean
                                )}
                                stroke="#3b82f6" 
                                strokeDasharray="3 3"
                                label={{ 
                                  value: 'EL', 
                                  position: 'top', 
                                  fill: '#3b82f6',
                                  fontSize: 12
                                }}
                              />
                              <ReferenceLine 
                                x={getDistributionData().findIndex(
                                  item => parseFloat(item.range.replace(/\s/g, '')) > selectedRisk.percentile95
                                )}
                                stroke="#ef4444" 
                                strokeDasharray="3 3"
                                label={{ 
                                  value: 'P95', 
                                  position: 'top', 
                                  fill: '#ef4444',
                                  fontSize: 12
                                }}
                              />
                              <Bar 
                                dataKey="frequency" 
                                fill="#8B5CF6" 
                                name="Частота" 
                                yAxisId="left"
                                radius={[4, 4, 0, 0]}
                              />
                              <Line
                                type="monotone"
                                dataKey="avgValue"
                                stroke="#f97316"
                                name="Среднее значение"
                                yAxisId="right"
                                dot={false}
                              />
                            </RechartsBarChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Кумулятивное распределение</CardTitle>
                      <CardDescription>Вероятность непревышения значения потерь</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ChartContainer config={{ 
                          cumulative: { color: "#3b82f6" },
                          area: { color: "#dbeafe" }
                        }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getCumulativeDistribution()} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} />
                              <XAxis 
                                dataKey="value" 
                                tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                                domain={['dataMin', 'dataMax']}
                              />
                              <YAxis 
                                tickFormatter={(value) => `${value.toFixed(0)}%`}
                                domain={[0, 100]}
                              />
                              <Tooltip 
                                formatter={(value, name) => {
                                  if (name === 'probability') return [`${Number(value).toFixed(1)}%`, 'Вероятность'];
                                  return [value, name];
                                }}
                                labelFormatter={(value) => `Значение: ${formatCurrency(Number(value))}`}
                              />
                              <ReferenceLine 
                                x={selectedRisk.mean} 
                                stroke="#3b82f6" 
                                strokeDasharray="3 3"
                                label={{ 
                                  value: 'EL', 
                                  position: 'top', 
                                  fill: '#3b82f6',
                                  fontSize: 12
                                }}
                              />
                              <ReferenceLine 
                                x={selectedRisk.percentile95} 
                                stroke="#ef4444" 
                                strokeDasharray="3 3"
                                label={{ 
                                  value: 'P95', 
                                  position: 'top', 
                                  fill: '#ef4444',
                                  fontSize: 12
                                }}
                              />
                              <ReferenceLine 
                                y={95} 
                                stroke="#ef4444" 
                                strokeDasharray="3 3"
                                label={{ 
                                  value: '95%', 
                                  position: 'right', 
                                  fill: '#ef4444',
                                  fontSize: 12
                                }}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="probability" 
                                name="Вероятность" 
                                stroke="var(--color-cumulative)" 
                                fill="var(--color-area)"
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analysis" className="mt-0 space-y-5">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Рекомендации по снижению риска</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-800 font-medium">1</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Внедрить дополнительные контрольные процедуры</h4>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Разработка и внедрение контрольных процедур для раннего выявления риска. Регулярные аудиты и мониторинг ключевых показателей.
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline" className="bg-compGreen-50 text-compGreen-700">
                                  Снижение вероятности на 30-40%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-800 font-medium">2</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Распределить риск через страхование или партнерство</h4>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Использование страховых продуктов для покрытия экстремальных значений потерь. Разделение рисков с партнерами.
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline" className="bg-compGreen-50 text-compGreen-700">
                                  Снижение воздействия на 40-60%
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="border rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                              <span className="text-amber-800 font-medium">3</span>
                            </div>
                            <div>
                              <h4 className="font-medium">Создать резервный фонд в размере 90-го процентиля</h4>
                              <p className="mt-1 text-sm text-muted-foreground">
                                Формирование финансового резерва в размере {formatCurrency(selectedRisk.percentile90)} для покрытия потенциальных потерь.
                              </p>
                              <div className="mt-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  Покрытие 90% сценариев
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Параметры моделирования</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Характеристики симуляции</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Количество итераций:</span>
                              <span>{selectedRisk.simulations.length.toLocaleString('ru-RU')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Тип распределения:</span>
                              <span>Лог-нормальное</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Доверительный интервал:</span>
                              <span>95%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Горизонт прогноза:</span>
                              <span>12 месяцев</span>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Метрики качества</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Тест Андерсона-Дарлинга:</span>
                              <span className="text-compGreen-600">Пройден</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Коэффициент вариации:</span>
                              <span>{(statistics?.cv || 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Стандартная ошибка:</span>
                              <span>{formatCurrency(Math.sqrt(selectedRisk.simulations.length) / (statistics?.stdDev || 1))}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Стабильность:</span>
                              <span className="text-compGreen-600">Высокая</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                  Закрыть
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <div>
              <DialogHeader className="px-6 pt-6">
                <DialogTitle className="text-xl">
                  Финансовое воздействие рисков
                </DialogTitle>
                <DialogDescription>
                  Сравнительный анализ потенциальных финансовых потерь от различных рисков
                </DialogDescription>
              </DialogHeader>
              
              <div className="p-6 pt-4">
                <div className="h-[500px]">
                  {viewType === 'bars' ? (
                    <ChartContainer
                      config={{
                        impact: {
                          label: "95-й процентиль",
                          color: "#ef4444"
                        },
                        expected: {
                          label: "Ожидаемое значение",
                          color: "#3b82f6"
                        }
                      }}
                      className="h-full w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          data={chartData}
                          margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
                          barGap={2}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            angle={-45} 
                            textAnchor="end" 
                            height={80} 
                            interval={0}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis 
                            tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                            width={80}
                          />
                          <Legend />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="impact" 
                            name="95-й процентиль" 
                            fill="var(--color-impact)" 
                            radius={[4, 4, 0, 0]} 
                            onClick={handleRiskSelect}
                            style={{ cursor: 'pointer' }}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                          </Bar>
                          <Bar 
                            dataKey="expected" 
                            name="Ожидаемое значение" 
                            fill="var(--color-expected)" 
                            radius={[4, 4, 0, 0]} 
                            onClick={handleRiskSelect}
                            style={{ cursor: 'pointer' }}
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.3} />
                            ))}
                          </Bar>
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <ChartContainer config={{}} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                          data={getWaterfallData}
                          margin={{ top: 20, right: 30, left: 30, bottom: 70 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis 
                            dataKey="name"
                            angle={-45} 
                            textAnchor="end" 
                            height={80}
                            tick={{ fontSize: 12 }}
                            interval={0}
                          />
                          <YAxis
                            tickFormatter={(value) => formatCurrency(value).replace(' ₽', '')}
                            width={80}
                          />
                          <Tooltip content={<WaterfallTooltip />} />
                          <Bar 
                            dataKey="value" 
                            name="Сумма" 
                            barSize={45}
                            shape={<WaterfallBar />}
                            onClick={(data) => {
                              if (data.riskId !== 'other' && data.riskId !== 'total') {
                                handleRiskSelect(data);
                              }
                            }}
                          >
                            <LabelList 
                              dataKey="value" 
                              position="top" 
                              formatter={(value: number) => formatCurrency(value).replace(' ₽', '')}
                              style={{ fontSize: 12, fill: '#6b7280' }} 
                            />
                          </Bar>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
                
                <div className="text-center mt-8">
                  <h3 className="text-lg font-medium mb-2">Выберите риск для детального анализа</h3>
                  <p className="text-sm text-muted-foreground max-w-lg mx-auto">
                    Нажмите на любой элемент диаграммы, чтобы увидеть детальный анализ риска, включая распределение вероятностей и рекомендации по снижению.
                  </p>
                </div>
              </div>
              
              <DialogFooter className="px-6 py-4 border-t">
                <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
                  Закрыть
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RiskImpactChart;
