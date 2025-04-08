
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SimulationResult } from './types';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

interface RiskImpactChartProps {
  simulationResults: SimulationResult[];
}

const RiskImpactChart: React.FC<RiskImpactChartProps> = ({ simulationResults }) => {
  // Prepare data for chart
  const chartData = simulationResults.map(result => ({
    name: result.title.length > 30 ? result.title.substring(0, 30) + '...' : result.title,
    impact: result.percentile95,
    expected: result.mean,
    min: result.min,
    max: result.max
  })).sort((a, b) => b.impact - a.impact);

  return (
    <ChartContainer
      config={{
        impact: {
          label: "95-й процентиль",
          color: "#ef4444" // Red for high impact
        },
        expected: {
          label: "Ожидаемое значение",
          color: "#3b82f6" // Blue for expected value
        }
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          barGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={60} 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={(value) => new Intl.NumberFormat('ru-RU', {
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value)}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-md">
                    <div className="text-sm font-medium">{payload[0].payload.name}</div>
                    <div className="text-xs text-muted-foreground mb-1">Финансовое воздействие:</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs">95-й процентиль:</span>
                        <span className="text-xs font-medium text-red-600">
                          {new Intl.NumberFormat('ru-RU').format(payload[0].payload.impact)} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs">Ожидаемое:</span>
                        <span className="text-xs font-medium text-blue-600">
                          {new Intl.NumberFormat('ru-RU').format(payload[0].payload.expected)} ₽
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs">Диапазон:</span>
                        <span className="text-xs">
                          {new Intl.NumberFormat('ru-RU').format(payload[0].payload.min)} - {new Intl.NumberFormat('ru-RU').format(payload[0].payload.max)} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="impact" fill="var(--color-impact)" name="95-й процентиль" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expected" fill="var(--color-expected)" name="Ожидаемое значение" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
};

export default RiskImpactChart;
