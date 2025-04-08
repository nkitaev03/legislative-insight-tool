
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell
} from 'recharts';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ChartType } from '@/types/dashboard';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface DataPoint {
  name: string;
  value: number;
  category?: string;
  [key: string]: any;
}

interface InteractiveChartProps {
  title: string;
  description?: string;
  data: DataPoint[];
  defaultChartType?: ChartType;
  dataKeys?: string[];
  colors?: string[];
  allowChartTypeChange?: boolean;
}

const defaultColors = [
  '#2DD4BF', '#0EA5E9', '#8B5CF6', '#F97316', '#10B981', 
  '#EC4899', '#F43F5E', '#64748B', '#2563EB', '#6366F1'
];

const InteractiveChart: React.FC<InteractiveChartProps> = ({
  title,
  description,
  data,
  defaultChartType = 'bar',
  dataKeys = ['value'],
  colors = defaultColors,
  allowChartTypeChange = true
}) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [hoveredData, setHoveredData] = useState<DataPoint | null>(null);
  const [isTooltipActive, setIsTooltipActive] = useState(false);

  const handleMouseOver = (data: DataPoint) => {
    setHoveredData(data);
    setIsTooltipActive(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipActive(false);
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} onMouseLeave={handleMouseLeave}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="p-2 bg-background border rounded-lg shadow-md">
                        <p className="font-medium">{label}</p>
                        {payload.map((entry: any, index: number) => (
                          <p key={`item-${index}`} style={{ color: entry.color }}>
                            {entry.name}: {entry.value}
                          </p>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {dataKeys.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  onMouseOver={(data) => {
                    if (data && data.payload) {
                      handleMouseOver(data.payload);
                    }
                  }}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} onMouseLeave={handleMouseLeave}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {dataKeys.map((key, index) => (
                <Area 
                  key={key}
                  type="monotone" 
                  dataKey={key} 
                  stackId="1"
                  stroke={colors[index % colors.length]}
                  fill={colors[index % colors.length]}
                  fillOpacity={0.3}
                  // Use a named function to avoid type issues with anonymous functions
                  onMouseEnter={(data) => {
                    if (data && data.payload) {
                      handleMouseOver(data.payload);
                    }
                  }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ChartContainer 
            config={{
              key1: { color: "#2DD4BF" },
              key2: { color: "#0EA5E9" },
              key3: { color: "#8B5CF6" },
            }}
            className="w-full h-[300px] my-5" 
          >
            <PieChart width={400} height={300} onMouseLeave={handleMouseLeave}>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                onMouseEnter={(_, index) => {
                  if (index >= 0 && index < data.length) {
                    handleMouseOver(data[index]);
                  }
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="p-2 bg-background border rounded-lg shadow-md">
                        <p className="font-medium">{item.name}</p>
                        <p>Значение: {item.value}</p>
                        {item.category && <p>Категория: {item.category}</p>}
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ChartContainer>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {allowChartTypeChange && (
          <Select value={chartType} onValueChange={(value: ChartType) => setChartType(value)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Тип графика" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Столбчатый</SelectItem>
              <SelectItem value="line">Линейный</SelectItem>
              <SelectItem value="pie">Круговой</SelectItem>
            </SelectContent>
          </Select>
        )}
      </CardHeader>
      <CardContent>
        {renderChart()}
        
        {isTooltipActive && hoveredData && (
          <div className="mt-4 p-3 border rounded-lg bg-muted/20">
            <h4 className="font-medium">{hoveredData.name}</h4>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(hoveredData)
                .filter(([key]) => key !== 'name' && key !== 'fill' && key !== 'color')
                .map(([key, value]) => (
                  <div key={key}>
                    <span className="text-xs text-muted-foreground">{key}: </span>
                    <span className="text-sm font-medium">{value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InteractiveChart;
