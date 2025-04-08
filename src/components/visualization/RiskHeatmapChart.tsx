
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskScenario } from '@/types/dashboard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChartContainer } from '@/components/ui/chart';

interface RiskHeatmapChartProps {
  risks: RiskScenario[];
  title?: string;
  description?: string;
  onRiskSelect?: (risk: RiskScenario) => void;
}

const RiskHeatmapChart: React.FC<RiskHeatmapChartProps> = ({ 
  risks, 
  title = "Карта рисков", 
  description = "Матрица вероятности и воздействия рисков",
  onRiskSelect 
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = Array.from(new Set(risks.map(risk => risk.category)));
  
  const filteredRisks = selectedCategory === "all" 
    ? risks 
    : risks.filter(risk => risk.category === selectedCategory);

  // Define heatmap grid
  const impactLabels = ["Низкое", "Среднее", "Высокое", "Критическое"];
  const probabilityLabels = ["Маловероятно", "Возможно", "Вероятно", "Почти наверняка"];
  
  // Map risk scores to colors
  const getColor = (probability: number, impact: number) => {
    const score = probability * impact;
    if (score < 4) return "bg-green-100 hover:bg-green-200 border-green-300";
    if (score < 9) return "bg-yellow-100 hover:bg-yellow-200 border-yellow-300";
    if (score < 12) return "bg-orange-100 hover:bg-orange-200 border-orange-300";
    return "bg-red-100 hover:bg-red-200 border-red-300";
  };
  
  // Map risk probability and impact to grid positions
  const mapToGridPosition = (value: number): number => {
    if (value < 0.25) return 0;
    if (value < 0.5) return 1;
    if (value < 0.75) return 2;
    return 3;
  };
  
  // Create a matrix to hold risks
  const matrix: RiskScenario[][][] = Array(4).fill(null).map(() => 
    Array(4).fill(null).map(() => [])
  );
  
  // Populate matrix with risks
  filteredRisks.forEach(risk => {
    const impactIndex = mapToGridPosition(risk.impact);
    const probabilityIndex = mapToGridPosition(risk.probability);
    matrix[probabilityIndex][impactIndex].push(risk);
  });

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Все категории" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все категории</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer 
          config={{
            low: { color: "#dcfce7" },
            medium: { color: "#fef9c3" }, 
            high: { color: "#ffedd5" },
            critical: { color: "#fee2e2" }
          }}
          className="relative"
        >
          <div className="grid grid-cols-5 gap-1">
            {/* Header for Impact */}
            <div className="text-right rotate-90 ml-auto flex items-center justify-center h-full">
              <span className="font-medium text-sm text-muted-foreground">Вероятность</span>
            </div>
            
            {/* Impact headers */}
            {impactLabels.map((label, index) => (
              <div key={`impact-${index}`} className="text-center mb-2">
                <span className="text-xs font-medium">{label}</span>
              </div>
            ))}

            {/* Matrix */}
            {probabilityLabels.map((probLabel, probIndex) => (
              <React.Fragment key={`prob-row-${probIndex}`}>
                {/* Probability label */}
                <div className="text-right pr-2 flex items-center justify-end h-full">
                  <span className="text-xs">{probLabel}</span>
                </div>
                
                {/* Risk cells */}
                {impactLabels.map((_, impactIndex) => {
                  const cellRisks = matrix[3 - probIndex][impactIndex];
                  const cellScore = (4 - probIndex) * (impactIndex + 1);
                  
                  return (
                    <div 
                      key={`cell-${probIndex}-${impactIndex}`}
                      className={`relative p-2 min-h-16 border rounded-md ${getColor(4 - probIndex, impactIndex + 1)}`}
                    >
                      {cellRisks.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div 
                                className="w-full h-full cursor-pointer"
                                onClick={() => cellRisks.length === 1 && onRiskSelect?.(cellRisks[0])}
                              >
                                <div className="text-center font-medium">
                                  {cellRisks.length}
                                </div>
                                {cellRisks.length <= 2 && (
                                  <div className="text-xs truncate mt-1">
                                    {cellRisks.map(risk => risk.name).join(", ")}
                                  </div>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-sm">
                              <div className="p-2">
                                <p className="font-medium mb-1">Риски в этом квадранте:</p>
                                <ul className="space-y-1 text-sm max-h-[200px] overflow-y-auto">
                                  {cellRisks.map(risk => (
                                    <li 
                                      key={risk.id} 
                                      className="hover:bg-muted p-1 rounded cursor-pointer"
                                      onClick={() => onRiskSelect?.(risk)}
                                    >
                                      {risk.name}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="text-center text-muted-foreground text-xs">
                          {cellScore}
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default RiskHeatmapChart;
