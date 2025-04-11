
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationResult } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import MonteCarloSimulator from './MonteCarloSimulator';
import { ChartContainer } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeftRight, BarChart3, LineChart, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskDistributionChartProps {
  result: SimulationResult;
  title?: string;
}

const RiskDistributionChart: React.FC<RiskDistributionChartProps> = ({ 
  result,
  title = "Распределение риска" 
}) => {
  const [chartType, setChartType] = React.useState<'area' | 'bar'>('area');
  const [distributionType, setDistributionType] = React.useState<"normal" | "triangular" | "uniform">("triangular");
  const [confidenceLevel, setConfidenceLevel] = React.useState<"90" | "95" | "99">("95");
  
  // Create a MonteCarloSimulator instance for visualization
  const simulator = new MonteCarloSimulator(result.min, result.max);
  simulator.distributionType = distributionType;
  
  // Create histogram data for bar chart
  const histogramData = simulator.createDistributionHistogram(result.simulations, 20)
    .map(bin => ({
      range: `${bin.binStart.toLocaleString(undefined, { maximumFractionDigits: 0 })} - ${bin.binEnd.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      count: bin.count,
      percentage: bin.percentage
    }));
  
  // Create smooth distribution data for area chart
  const distributionData = simulator.generateDistributionData(result.simulations)
    .map(point => ({
      value: point.x,
      probability: point.y * 1000 // Scale for better visualization
    }));
  
  // Calculate key statistics for display
  const keyStats = [
    { name: 'Минимум', value: result.min.toLocaleString() },
    { name: 'Максимум', value: result.max.toLocaleString() },
    { name: 'Среднее', value: result.mean.toLocaleString() },
    { name: 'Медиана', value: result.median.toLocaleString() },
    { name: '90-й процентиль', value: result.percentile90.toLocaleString() },
    { name: '95-й процентиль', value: result.percentile95.toLocaleString() },
    { name: '99-й процентиль', value: (result.percentile99 || 0).toLocaleString() }
  ];

  // Get confidence interval value based on selected level
  const getConfidenceValue = () => {
    return confidenceLevel === "90" ? result.percentile90 :
           confidenceLevel === "95" ? result.percentile95 :
           result.percentile99 || 0;
  };

  const chartColors = {
    normal: '#8884d8',
    triangular: '#82ca9d',
    uniform: '#ffc658'
  };

  // Animation variants for charts
  const chartAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle>{title}: {result.title}</CardTitle>
            <CardDescription>
              {result.scenarioName} ({result.scenarioType})
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Select
              value={distributionType}
              onValueChange={(value) => setDistributionType(value as any)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Тип распределения" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Нормальное</SelectItem>
                <SelectItem value="triangular">Треугольное</SelectItem>
                <SelectItem value="uniform">Равномерное</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={chartType}
              onValueChange={(value) => setChartType(value as any)}
            >
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Тип графика" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="area">Линейный</SelectItem>
                <SelectItem value="bar">Гистограмма</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Tabs defaultValue="distribution" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="distribution" className="flex items-center gap-1">
                <LineChart className="h-4 w-4" />
                <span>Распределение</span>
              </TabsTrigger>
              <TabsTrigger value="probability" className="flex items-center gap-1">
                <BarChart3 className="h-4 w-4" />
                <span>Плотность вероятности</span>
              </TabsTrigger>
              <TabsTrigger value="confidence" className="flex items-center gap-1">
                <ArrowLeftRight className="h-4 w-4" />
                <span>Доверительные интервалы</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="distribution" className="mt-6">
              <motion.div 
                variants={chartAnimation}
                initial="hidden"
                animate="visible"
                className="h-80 w-full"
              >
                <ChartContainer config={{ distribution: { color: chartColors[distributionType] } }}>
                  {chartType === 'area' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={distributionData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="value" 
                          type="number"
                          domain={['dataMin', 'dataMax']}
                          tickFormatter={(value) => {
                            if (value >= 1000000) return (value / 1000000).toFixed(1) + 'M';
                            if (value >= 1000) return (value / 1000).toFixed(0) + 'K';
                            return value.toLocaleString(undefined, { maximumFractionDigits: 0 });
                          }}
                          tick={{fontSize: 11}}
                          interval={3}
                        />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => [value.toFixed(4), 'Вероятность']}
                          labelFormatter={(value) => `Значение: ${parseInt(value).toLocaleString()}`}
                        />
                        <defs>
                          <linearGradient id="colorDistribution" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartColors[distributionType]} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartColors[distributionType]} stopOpacity={0.2}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="probability" 
                          stroke={chartColors[distributionType]} 
                          fillOpacity={1} 
                          fill="url(#colorDistribution)" 
                        />
                        <Legend />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={histogramData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="range" 
                          tick={{fontSize: 10}} 
                          interval={histogramData.length > 10 ? 2 : 1}
                          height={50}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis yAxisId="left" orientation="left" label={{ value: 'Количество', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Процент', angle: 90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="count" name="Количество" fill={chartColors[distributionType]} />
                        <Bar yAxisId="right" dataKey="percentage" name="Процент" fill="#ff7300" />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </ChartContainer>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="probability" className="mt-6">
              <motion.div 
                variants={chartAnimation}
                initial="hidden"
                animate="visible"
                className="h-80 w-full"
              >
                <ChartContainer config={{ probability: { color: '#8884d8' } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={distributionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="value" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value: any) => [value.toFixed(4), 'Плотность вероятности']}
                        labelFormatter={(value) => `Значение: ${parseInt(value).toLocaleString()}`}
                      />
                      <defs>
                        <linearGradient id="colorProbability" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="#8884d8" 
                        fillOpacity={1} 
                        fill="url(#colorProbability)" 
                      />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="confidence" className="mt-6">
              <div className="mb-4">
                <label className="text-sm font-medium">Выберите уровень доверия:</label>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant={confidenceLevel === "90" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfidenceLevel("90")}
                    className="flex-1"
                  >
                    90%
                  </Button>
                  <Button
                    variant={confidenceLevel === "95" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfidenceLevel("95")}
                    className="flex-1"
                  >
                    95%
                  </Button>
                  <Button
                    variant={confidenceLevel === "99" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfidenceLevel("99")}
                    className="flex-1"
                  >
                    99%
                  </Button>
                </div>
              </div>
              
              <motion.div 
                variants={chartAnimation}
                initial="hidden"
                animate="visible"
                className="h-80 w-full"
              >
                <ChartContainer config={{ confidence: { color: '#82ca9d' } }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={distributionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 30 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="value" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        tickFormatter={(value) => value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      />
                      <YAxis />
                      <Tooltip />
                      <defs>
                        <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
                        </linearGradient>
                      </defs>
                      <Area 
                        type="monotone" 
                        dataKey="probability" 
                        stroke="#82ca9d" 
                        fillOpacity={1} 
                        fill="url(#confidenceGradient)" 
                      />
                      {/* Vertical line for confidence interval */}
                      <ReferenceLine 
                        x={getConfidenceValue()} 
                        stroke="red" 
                        strokeDasharray="3 3"
                        label={{ 
                          value: `${confidenceLevel}%: ${getConfidenceValue() >= 1000000 ? 
                            (getConfidenceValue() / 1000000).toFixed(1) + 'M' : 
                            getConfidenceValue() >= 1000 ? 
                            (getConfidenceValue() / 1000).toFixed(0) + 'K' : 
                            getConfidenceValue().toLocaleString()}`, 
                          position: 'top',
                          fill: 'red',
                          fontSize: 12
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </motion.div>
              
              <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">Доверительные интервалы:</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Доверительные интервалы показывают, с какой вероятностью фактическое значение будет меньше или равно указанному значению.
                </p>
                <ul className="space-y-1 text-sm">
                  <li>90% доверительный интервал: <span className="font-medium">{result.percentile90.toLocaleString()} ₽</span></li>
                  <li>95% доверительный интервал: <span className="font-medium">{result.percentile95.toLocaleString()} ₽</span></li>
                  <li>99% доверительный интервал: <span className="font-medium">{(result.percentile99 || 0).toLocaleString()} ₽</span></li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="mt-8 pt-4 border-t">
            <h3 className="text-md font-medium mb-3">Ключевые статистики</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
              {keyStats.map((stat, idx) => (
                <div key={idx} className="bg-muted p-3 rounded-md text-center">
                  <div className="text-xs text-muted-foreground mb-1">{stat.name}</div>
                  <div className="font-medium text-sm truncate" title={stat.value}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm mt-4 pt-3 border-t">
            <div className="text-muted-foreground">
              Тип распределения: <span className="font-medium">{
                distributionType === 'normal' ? 'Нормальное' : 
                distributionType === 'triangular' ? 'Треугольное' : 'Равномерное'
              }</span>
            </div>
            <div className="text-muted-foreground">
              Количество симуляций: <span className="font-medium">{result.simulations.length.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Ensure we import ReferenceLine
import { ReferenceLine } from 'recharts';

export default RiskDistributionChart;
