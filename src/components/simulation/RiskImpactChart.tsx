
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SimulationResult } from './types';
import { 
  ChartContainer, 
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Info } from 'lucide-react';

interface RiskImpactChartProps {
  simulationResults: SimulationResult[];
}

const RiskImpactChart: React.FC<RiskImpactChartProps> = ({ simulationResults }) => {
  const [activeRisk, setActiveRisk] = useState<SimulationResult | null>(null);
  
  // Prepare data for chart
  const chartData = simulationResults.map(result => ({
    name: result.title.length > 30 ? result.title.substring(0, 30) + '...' : result.title,
    impact: result.percentile95,
    expected: result.mean,
    min: result.min,
    max: result.max,
    originalResult: result // Store the original result for drill-down
  })).sort((a, b) => b.impact - a.impact);

  const handleBarClick = (data: any) => {
    // Set active risk for drill-down view
    const originalResult = data?.payload?.originalResult;
    if (originalResult) {
      setActiveRisk(originalResult);
    }
  };

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 z-10">
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="p-1 rounded-full text-muted-foreground hover:bg-muted">
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">О графике</h4>
              <p className="text-sm text-muted-foreground">
                Этот график показывает расчетное финансовое воздействие каждого риска в 95-м процентиле (красный) и ожидаемое значение (синий).
              </p>
              <p className="text-sm text-muted-foreground">
                Нажмите на столбец для просмотра детальной информации по риску.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>

      {activeRisk ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">{activeRisk.title}</h3>
            <button 
              onClick={() => setActiveRisk(null)}
              className="text-xs text-muted-foreground hover:text-primary"
            >
              ← Вернуться к общей диаграмме
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm font-medium mb-1">Ожидаемое значение</div>
              <div className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat('ru-RU').format(activeRisk.mean)} ₽
              </div>
              <div className="text-xs text-muted-foreground">
                Среднее значение из {activeRisk.simulations.length} симуляций
              </div>
            </div>
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="text-sm font-medium mb-1">95-й процентиль</div>
              <div className="text-xl font-bold text-red-600">
                {new Intl.NumberFormat('ru-RU').format(activeRisk.percentile95)} ₽
              </div>
              <div className="text-xs text-muted-foreground">
                Значение с 95% уверенностью не будет превышено
              </div>
            </div>
          </div>

          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  { name: 'Мин', value: activeRisk.min },
                  { name: 'Средняя', value: activeRisk.mean },
                  { name: 'Медиана', value: activeRisk.median },
                  { name: '90%', value: activeRisk.percentile90 },
                  { name: '95%', value: activeRisk.percentile95 },
                  { name: 'Макс', value: activeRisk.max }
                ]}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => new Intl.NumberFormat('ru-RU', {
                    notation: 'compact',
                    compactDisplay: 'short'
                  }).format(value)}
                />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('ru-RU').format(value) + ' ₽'}
                />
                <Bar 
                  dataKey="value" 
                  fill="var(--color-impact)" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Диапазон потенциальных потерь: от {new Intl.NumberFormat('ru-RU').format(activeRisk.min)} ₽ до {new Intl.NumberFormat('ru-RU').format(activeRisk.max)} ₽
          </div>
        </div>
      ) : (
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
              <Bar 
                dataKey="impact" 
                fill="var(--color-impact)" 
                name="95-й процентиль" 
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              />
              <Bar 
                dataKey="expected" 
                fill="var(--color-expected)" 
                name="Ожидаемое значение" 
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                cursor="pointer"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
};

export default RiskImpactChart;
