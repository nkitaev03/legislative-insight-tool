
import React from 'react';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RiskScenario } from '@/types/dashboard';
import InteractiveTooltip from '@/components/common/InteractiveTooltip';

interface RiskHeatmapWidgetProps {
  risks?: RiskScenario[];
}

const defaultRisks: RiskScenario[] = [
  { id: '1', name: 'Потеря ключевых клиентов', probability: 0.4, impact: 0.9, category: 'Финансовые', description: 'Риск потери 2-3 ключевых клиентов из-за конкуренции' },
  { id: '2', name: 'Задержки поставок', probability: 0.7, impact: 0.5, category: 'Операционные', description: 'Риск задержки поставок из-за проблем у поставщиков' },
  { id: '3', name: 'Киберугрозы', probability: 0.3, impact: 0.8, category: 'Технологические', description: 'Угроза кибератак и потери данных' },
  { id: '4', name: 'Изменения в законодательстве', probability: 0.6, impact: 0.7, category: 'Юридические', description: 'Изменения в налоговом законодательстве' },
  { id: '5', name: 'Новый конкурент', probability: 0.5, impact: 0.6, category: 'Стратегические', description: 'Выход на рынок крупного международного игрока' },
  { id: '6', name: 'Негативные отзывы', probability: 0.6, impact: 0.3, category: 'Репутационные', description: 'Распространение негативных отзывов в соцсетях' },
  { id: '7', name: 'Валютные колебания', probability: 0.8, impact: 0.4, category: 'Финансовые', description: 'Риск изменения валютных курсов' },
  { id: '8', name: 'Текучесть кадров', probability: 0.4, impact: 0.5, category: 'Операционные', description: 'Уход ключевых сотрудников к конкурентам' },
];

const RiskHeatmapWidget: React.FC<RiskHeatmapWidgetProps> = ({ risks = defaultRisks }) => {
  // Colors for different risk levels
  const getBackgroundColor = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    
    if (riskScore >= 0.6) return 'bg-red-500 hover:bg-red-600';
    if (riskScore >= 0.3) return 'bg-yellow-500 hover:bg-yellow-600';
    return 'bg-green-500 hover:bg-green-600';
  };
  
  const getTextColor = (probability: number, impact: number) => {
    const riskScore = probability * impact;
    
    if (riskScore >= 0.3) return 'text-white';
    return 'text-gray-900';
  };

  return (
    <>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Тепловая карта рисков</CardTitle>
          <InteractiveTooltip
            content={
              <div className="space-y-2">
                <p>Тепловая карта отображает риски в зависимости от их вероятности и потенциального воздействия.</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Красный цвет – высокий уровень риска</li>
                  <li>Желтый цвет – средний уровень риска</li>
                  <li>Зеленый цвет – низкий уровень риска</li>
                </ul>
                <p>Наведите курсор на ячейку, чтобы увидеть список рисков в этой категории.</p>
              </div>
            }
          />
        </div>
        <CardDescription>
          Распределение рисков по вероятности и воздействию
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden">
          {/* Y-axis label */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 transform rotate-90 text-xs text-muted-foreground">
            Воздействие
          </div>
          
          {/* X-axis label */}
          <div className="text-center text-xs text-muted-foreground mb-1">
            Вероятность
          </div>
          
          <div className="grid grid-cols-5 gap-1">
            {/* Headers for probability */}
            <div className="col-start-2 col-span-5 grid grid-cols-5 gap-1 mb-1">
              <div className="text-center text-xs">Очень низкая</div>
              <div className="text-center text-xs">Низкая</div>
              <div className="text-center text-xs">Средняя</div>
              <div className="text-center text-xs">Высокая</div>
              <div className="text-center text-xs">Очень высокая</div>
            </div>
            
            {/* Headers for impact + heatmap cells */}
            {[0.9, 0.7, 0.5, 0.3, 0.1].map((impact, impactIndex) => {
              const impactLabels = ['Критическое', 'Значительное', 'Умеренное', 'Незначительное', 'Минимальное'];
              
              return (
                <React.Fragment key={`impact-${impact}`}>
                  {/* Impact label */}
                  <div className="flex items-center justify-end pr-2 text-xs">
                    {impactLabels[impactIndex]}
                  </div>
                  
                  {/* Heatmap cells */}
                  {[0.1, 0.3, 0.5, 0.7, 0.9].map((probability) => {
                    // Find risks in this cell
                    const cellRisks = risks.filter(risk => {
                      const impactRange = impact - 0.1 < risk.impact && risk.impact <= impact + 0.1;
                      const probabilityRange = probability - 0.1 < risk.probability && risk.probability <= probability + 0.1;
                      return impactRange && probabilityRange;
                    });
                    
                    const hasRisks = cellRisks.length > 0;
                    
                    return (
                      <div 
                        key={`cell-${impact}-${probability}`}
                        className={`
                          h-12 rounded-md flex items-center justify-center transition-colors
                          ${getBackgroundColor(probability, impact)}
                          ${hasRisks ? 'cursor-pointer' : 'opacity-70'}
                        `}
                      >
                        {hasRisks ? (
                          <InteractiveTooltip
                            content={
                              <div>
                                <div className="font-medium mb-1">Риски в ячейке:</div>
                                <ul className="list-disc pl-4 space-y-1">
                                  {cellRisks.map(risk => (
                                    <li key={risk.id}>
                                      <span className="font-medium">{risk.name}</span>
                                      <div className="text-xs text-muted-foreground">{risk.description}</div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            }
                            icon={false}
                          >
                            <span className={`font-bold ${getTextColor(probability, impact)}`}>
                              {cellRisks.length}
                            </span>
                          </InteractiveTooltip>
                        ) : (
                          <span className={`text-xs ${getTextColor(probability, impact)}`}>-</span>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
          
          <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-green-500 rounded"></div>
              <span>Низкий риск</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-yellow-500 rounded"></div>
              <span>Средний риск</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 bg-red-500 rounded"></div>
              <span>Высокий риск</span>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
};

export default RiskHeatmapWidget;
