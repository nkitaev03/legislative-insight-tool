
import React, { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SimulationResult } from './types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Layers, ZoomIn, ArrowLeft, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RiskImpactChartProps {
  simulationResults: SimulationResult[];
  onRiskSelect?: (riskId: string) => void;
}

const RiskImpactChart: React.FC<RiskImpactChartProps> = ({ simulationResults, onRiskSelect }) => {
  const [selectedRisk, setSelectedRisk] = useState<SimulationResult | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Prepare data for chart
  const chartData = simulationResults.map(result => ({
    name: result.title.length > 30 ? result.title.substring(0, 30) + '...' : result.title,
    impact: result.percentile95,
    expected: result.mean,
    min: result.min,
    max: result.max,
    riskId: result.riskId
  })).sort((a, b) => b.impact - a.impact);

  // Function to handle bar click for drill-down
  const handleBarClick = (data: any) => {
    const selectedRiskId = data.riskId;
    const risk = simulationResults.find(r => r.riskId === selectedRiskId);
    if (risk) {
      setSelectedRisk(risk);
      if (onRiskSelect) {
        onRiskSelect(selectedRiskId);
      } else {
        setShowDetailDialog(true);
      }
    }
  };

  // Prepare distribution data for selected risk
  const getDistributionData = () => {
    if (!selectedRisk) return [];
    
    // Calculate bins for histogram
    const simulations = selectedRisk.simulations;
    const min = Math.min(...simulations);
    const max = Math.max(...simulations);
    const range = max - min;
    const binCount = 15;
    const binSize = range / binCount;
    
    const bins = Array(binCount).fill(0).map((_, i) => {
      const start = min + i * binSize;
      const end = min + (i + 1) * binSize;
      const count = simulations.filter(val => val >= start && val < end).length;
      
      return {
        range: `${new Intl.NumberFormat('ru-RU').format(Math.floor(start))}`,
        count,
        frequency: count / simulations.length,
      };
    });
    
    return bins;
  };

  return (
    <>
      <div className="relative h-full">
        <div className="absolute right-0 top-0 z-10">
          <Button variant="ghost" size="sm" onClick={() => setShowDetailDialog(true)}>
            <ZoomIn className="h-4 w-4 mr-1" />
            Детали
          </Button>
        </div>
        
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
                          <div className="mt-1 pt-1 border-t text-center">
                            <span className="text-xs text-blue-600">Нажмите для детального анализа</span>
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
                style={{ cursor: 'pointer' }}
              />
              <Bar 
                dataKey="expected" 
                fill="var(--color-expected)" 
                name="Ожидаемое значение" 
                radius={[4, 4, 0, 0]} 
                onClick={handleBarClick}
                style={{ cursor: 'pointer' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Detail dialog for drill-down analysis */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedRisk 
                ? `Детальный анализ риска: ${selectedRisk.title}` 
                : 'Распределение финансового воздействия рисков'}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRisk ? (
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedRisk(null)}
                className="mb-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Назад к общему обзору
              </Button>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Параметры симуляции</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Количество симуляций:</div>
                    <div className="font-medium">{selectedRisk.simulations.length}</div>
                    <div className="text-muted-foreground">Среднее значение:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.mean)} ₽</div>
                    <div className="text-muted-foreground">Медиана:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.median)} ₽</div>
                    <div className="text-muted-foreground">Минимум:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.min)} ₽</div>
                    <div className="text-muted-foreground">Максимум:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.max)} ₽</div>
                    <div className="text-muted-foreground">90-й процентиль:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.percentile90)} ₽</div>
                    <div className="text-muted-foreground">95-й процентиль:</div>
                    <div className="font-medium">{new Intl.NumberFormat('ru-RU').format(selectedRisk.percentile95)} ₽</div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-sm font-medium mb-2">Рекомендации по снижению риска</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-800 text-xs">1</span>
                      </div>
                      <span>Внедрить дополнительные контрольные процедуры</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-800 text-xs">2</span>
                      </div>
                      <span>Распределить риск через страхование или партнерство</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-orange-800 text-xs">3</span>
                      </div>
                      <span>Создать резервный фонд в размере 90-го процентиля</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Distribution chart */}
              <div className="border rounded-lg p-4">
                <h3 className="text-sm font-medium mb-4">Распределение результатов симуляции</h3>
                <div className="h-64">
                  <ChartContainer config={{ frequency: { color: "#8B5CF6" } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getDistributionData()} margin={{ top: 10, right: 30, left: 10, bottom: 30 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis 
                          dataKey="range" 
                          tick={{ fontSize: 10 }}
                          angle={-45} 
                          textAnchor="end"
                          interval={0}
                        />
                        <YAxis 
                          tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
                          domain={[0, 'dataMax']}
                        />
                        <Tooltip 
                          formatter={(value) => [`${(Number(value) * 100).toFixed(1)}%`, 'Частота']}
                          labelFormatter={(label) => `Значение: ~${label} ₽`}
                        />
                        <Bar 
                          dataKey="frequency" 
                          fill="var(--color-frequency)" 
                          name="Частота" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center p-6 max-w-lg">
                <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Выберите риск для детального анализа</h3>
                <p className="text-sm text-muted-foreground">
                  Нажмите на элемент диаграммы выше для просмотра подробного анализа и распределения.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RiskImpactChart;
