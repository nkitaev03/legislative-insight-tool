
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define the data structure for financial metrics
interface FinancialMetric {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  marginPercentage: number;
  growthRate?: number;
}

// Sample financial data
const financialData: FinancialMetric[] = [
  { month: 'Янв', revenue: 320000, expenses: 240000, profit: 80000, marginPercentage: 25, growthRate: 0 },
  { month: 'Фев', revenue: 340000, expenses: 250000, profit: 90000, marginPercentage: 26.5, growthRate: 12.5 },
  { month: 'Мар', revenue: 380000, expenses: 270000, profit: 110000, marginPercentage: 28.9, growthRate: 22.2 },
  { month: 'Апр', revenue: 400000, expenses: 280000, profit: 120000, marginPercentage: 30, growthRate: 9.1 },
  { month: 'Май', revenue: 430000, expenses: 290000, profit: 140000, marginPercentage: 32.6, growthRate: 16.7 },
  { month: 'Июн', revenue: 470000, expenses: 310000, profit: 160000, marginPercentage: 34, growthRate: 14.3 },
  { month: 'Июл', revenue: 490000, expenses: 320000, profit: 170000, marginPercentage: 34.7, growthRate: 6.3 },
  { month: 'Авг', revenue: 520000, expenses: 330000, profit: 190000, marginPercentage: 36.5, growthRate: 11.8 },
  { month: 'Сен', revenue: 550000, expenses: 350000, profit: 200000, marginPercentage: 36.4, growthRate: 5.3 },
  { month: 'Окт', revenue: 580000, expenses: 370000, profit: 210000, marginPercentage: 36.2, growthRate: 5 },
  { month: 'Ноя', revenue: 610000, expenses: 380000, profit: 230000, marginPercentage: 37.7, growthRate: 9.5 },
  { month: 'Дек', revenue: 650000, expenses: 400000, profit: 250000, marginPercentage: 38.5, growthRate: 8.7 }
];

// Define metric configurations for consistent styling and formatting
const metricConfig = {
  revenue: {
    name: 'Выручка',
    color: '#4f46e5',
    formatter: (value: number) => `${(value / 1000).toFixed(0)} тыс. ₽`
  },
  expenses: {
    name: 'Расходы',
    color: '#ef4444',
    formatter: (value: number) => `${(value / 1000).toFixed(0)} тыс. ₽`
  },
  profit: {
    name: 'Прибыль',
    color: '#10b981',
    formatter: (value: number) => `${(value / 1000).toFixed(0)} тыс. ₽`
  },
  marginPercentage: {
    name: 'Маржинальность',
    color: '#f59e0b',
    formatter: (value: number) => `${value.toFixed(1)}%`
  },
  growthRate: {
    name: 'Темп роста',
    color: '#8b5cf6',
    formatter: (value: number) => `${value.toFixed(1)}%`
  }
};

interface FinancialForecastChartProps {
  title?: string;
  description?: string;
  data?: FinancialMetric[];
}

const FinancialForecastChart: React.FC<FinancialForecastChartProps> = ({
  title = "Финансовый прогноз",
  description = "Динамика финансовых показателей компании",
  data = financialData
}) => {
  const [activeMetric, setActiveMetric] = useState<keyof typeof metricConfig>('revenue');
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');
  
  const formatValue = (value: number) => {
    return metricConfig[activeMetric].formatter(value);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-4">
          <Tabs 
            defaultValue={activeMetric} 
            value={activeMetric}
            onValueChange={(value) => setActiveMetric(value as keyof typeof metricConfig)}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
              <TabsTrigger value="revenue">Выручка</TabsTrigger>
              <TabsTrigger value="expenses">Расходы</TabsTrigger>
              <TabsTrigger value="profit">Прибыль</TabsTrigger>
              <TabsTrigger value="marginPercentage">Маржинальность</TabsTrigger>
              <TabsTrigger value="growthRate">Темп роста</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'line' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Линейный
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1 rounded-md text-sm ${
                chartType === 'bar' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              Столбчатый
            </button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-80 w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => {
                    if (activeMetric === 'marginPercentage' || activeMetric === 'growthRate') {
                      return `${value}%`;
                    }
                    return `${(value / 1000).toFixed(0)}K`;
                  }}
                />
                <Tooltip formatter={formatValue} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={activeMetric}
                  name={metricConfig[activeMetric].name}
                  stroke={metricConfig[activeMetric].color}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  tickFormatter={(value) => {
                    if (activeMetric === 'marginPercentage' || activeMetric === 'growthRate') {
                      return `${value}%`;
                    }
                    return `${(value / 1000).toFixed(0)}K`;
                  }}
                />
                <Tooltip formatter={formatValue} />
                <Legend />
                <Bar
                  dataKey={activeMetric}
                  name={metricConfig[activeMetric].name}
                  fill={metricConfig[activeMetric].color}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Key metrics summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <MetricCard 
            title="Средняя ежемесячная выручка" 
            value={`${(data.reduce((acc, item) => acc + item.revenue, 0) / data.length / 1000).toFixed(0)} тыс. ₽`}
            trend={+8.5}
          />
          <MetricCard 
            title="Средняя прибыль" 
            value={`${(data.reduce((acc, item) => acc + item.profit, 0) / data.length / 1000).toFixed(0)} тыс. ₽`}
            trend={+12.4}
          />
          <MetricCard 
            title="Средняя маржинальность" 
            value={`${(data.reduce((acc, item) => acc + item.marginPercentage, 0) / data.length).toFixed(1)}%`}
            trend={+3.2}
          />
          <MetricCard 
            title="Прогноз роста на год" 
            value={`${((data[data.length - 1].revenue / data[0].revenue - 1) * 100).toFixed(1)}%`}
            trend={+5.8}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Simple metric card component for displaying summary metrics
interface MetricCardProps {
  title: string;
  value: string;
  trend: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend }) => {
  return (
    <div className="bg-muted/30 p-4 rounded-lg border">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="mt-1 flex items-baseline justify-between">
        <div className="text-xl font-semibold">{value}</div>
        <div className={`flex items-center text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '+' : ''}{trend}%
        </div>
      </div>
    </div>
  );
};

export default FinancialForecastChart;
