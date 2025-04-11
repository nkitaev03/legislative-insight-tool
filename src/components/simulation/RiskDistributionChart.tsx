
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
      <CardContent className="pt-2 pb-4"> {/* Adjusted padding */}
        <div className="space-y-6">
          {/* Single chart with improved layout */}
          <div className="mt-6">
            <motion.div 
              variants={chartAnimation}
              initial="hidden"
              animate="visible"
              className="h-80 w-full" /* Increased height of chart */
            >
              <ChartContainer config={{ distribution: { color: chartColors[distributionType] } }}>
                {chartType === 'area' ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={distributionData}
                      margin={{ top: 10, right: 30, left: 10, bottom: 50 }} /* Increased bottom margin */
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="value" 
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        height={60} /* Increased axis height for labels */
                        tick={{fontSize: 10}} /* Smaller font for better spacing */
                        tickFormatter={(value) => {
                          // Format large numbers with abbreviated suffixes
                          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                          if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                          return value.toString();
                        }}
                        interval="preserveEnd" /* Better interval selection */
                      />
                      <YAxis 
                        width={50} /* Wider axis for labels */
                        tickFormatter={(value) => value.toFixed(4)} /* Shorter Y values */
                      />
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
                      <Legend wrapperStyle={{ bottom: -30 }} /* Position legend lower */ />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={histogramData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }} /* Increased bottom margin */
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="range" 
                        tick={(props) => {
                          const { x, y, payload } = props;
                          return (
                            <g transform={`translate(${x},${y})`}>
                              <text 
                                x={0} 
                                y={0} 
                                dy={16} 
                                textAnchor="end"
                                fill="#666"
                                fontSize={9}
                                transform="rotate(-45)"
                              >
                                {payload.value}
                              </text>
                            </g>
                          );
                        }}
                        height={70} /* More space for angled labels */
                        interval={0} /* Show all labels */
                      />
                      <YAxis yAxisId="left" orientation="left" width={50} />
                      <YAxis yAxisId="right" orientation="right" width={50} />
                      <Tooltip />
                      <Legend wrapperStyle={{ bottom: -40 }} /* Position legend lower */ />
                      <Bar yAxisId="left" dataKey="count" name="Количество" fill={chartColors[distributionType]} />
                      <Bar yAxisId="right" dataKey="percentage" name="Процент" fill="#ff7300" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </ChartContainer>
            </motion.div>
          </div>
          
          {/* Key Statistics section with improved spacing */}
          <div className="mt-10"> {/* More vertical space after chart */}
            <h3 className="text-md font-medium mb-4">Ключевые статистики</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3"> {/* Increased gap */}
              {keyStats.map((stat, idx) => (
                <div key={idx} className="bg-muted p-3 rounded-md text-center"> {/* Increased padding */}
                  <div className="text-xs text-muted-foreground mb-1">{stat.name}</div> {/* Added margin */}
                  <div className="font-medium text-sm">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer metadata with improved spacing */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-6 pt-3 border-t"> {/* Added border top for visual separation */}
            <div className="text-muted-foreground text-sm">
              Тип распределения: <span className="font-medium">{
                distributionType === 'normal' ? 'Нормальное' : 
                distributionType === 'triangular' ? 'Треугольное' : 'Равномерное'
              }</span>
            </div>
            <div className="text-muted-foreground text-sm">
              Количество симуляций: <span className="font-medium">{result.simulations.length}</span>
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
