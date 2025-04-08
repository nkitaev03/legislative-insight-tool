
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SimulationResult } from './types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import MonteCarloSimulator from './MonteCarloSimulator';
import { ChartContainer } from '@/components/ui/chart';

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
    { name: '99-й процентиль', value: result.percentile99.toLocaleString() }
  ];

  const chartColors = {
    normal: '#8884d8',
    triangular: '#82ca9d',
    uniform: '#ffc658'
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
          <div className="h-64 w-full">
            <ChartContainer config={{ distribution: { color: chartColors[distributionType] } }}>
              {chartType === 'area' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={distributionData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" tick={{fontSize: 10}} interval={histogramData.length > 10 ? 1 : 0} />
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
          </div>
          
          <div>
            <h3 className="text-md font-medium mb-2">Ключевые статистики</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
              {keyStats.map((stat, idx) => (
                <div key={idx} className="bg-muted p-2 rounded-md text-center">
                  <div className="text-xs text-muted-foreground">{stat.name}</div>
                  <div className="font-medium">{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <div className="text-muted-foreground">
              Тип распределения: <span className="font-medium">{
                distributionType === 'normal' ? 'Нормальное' : 
                distributionType === 'triangular' ? 'Треугольное' : 'Равномерное'
              }</span>
            </div>
            <div className="text-muted-foreground">
              Количество симуляций: <span className="font-medium">{result.simulations.length}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskDistributionChart;
