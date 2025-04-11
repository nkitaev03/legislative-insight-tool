
import React, { useState } from 'react';
import { Calendar, Flag, Target, TrendingUp, BarChart3, List, ArrowRight, Clock, CheckCircle, Clock1, Calendar as CalendarIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LegislationItem } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { 
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  XAxis, 
  YAxis,
  Tooltip,
  Rectangle,
  ScatterChart,
  ZAxis
} from 'recharts';

interface LegislationTimelineProps {
  items: LegislationItem[];
}

// Helper to format date for display
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return 'Дата не указана';
  
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Недействительная дата';
    }
    
    return new Intl.DateTimeFormat('ru-RU', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Ошибка даты';
  }
};

// Format month for display in chart
const formatMonth = (date: Date): string => {
  try {
    return new Intl.DateTimeFormat('ru-RU', { 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return 'Неизв.';
  }
};

const LegislationTimeline: React.FC<LegislationTimelineProps> = ({ items }) => {
  const [viewType, setViewType] = useState<'gantt' | 'vertical'>('gantt');
  
  // Filter items with strategic impact and sort by implementation date
  const strategicItems = items
    .filter(item => item.strategicImpact && item.implementationDate)
    .sort((a, b) => {
      try {
        const dateA = new Date(a.implementationDate!);
        const dateB = new Date(b.implementationDate!);
        
        // Handle invalid dates
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1; // Place invalid dates at the end
        if (isNaN(dateB.getTime())) return -1;
        
        return dateA.getTime() - dateB.getTime();
      } catch (error) {
        console.error("Error sorting dates:", error);
        return 0;
      }
    });

  // Generate timeline data for Gantt-like chart
  const prepareGanttData = () => {
    if (strategicItems.length === 0) return { ganttBars: [], timeRange: { min: new Date(), max: new Date() } };
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Get valid dates for min/max calculation
    const validDates = strategicItems
      .filter(item => item.implementationDate)
      .map(item => {
        try {
          const date = new Date(item.implementationDate!);
          return isNaN(date.getTime()) ? null : date;
        } catch {
          return null;
        }
      })
      .filter(Boolean) as Date[];
    
    // Set default time range if no valid dates
    if (validDates.length === 0) {
      const defaultMin = new Date();
      const defaultMax = new Date();
      defaultMax.setMonth(defaultMax.getMonth() + 6);
      
      return { 
        ganttBars: [], 
        timeRange: { 
          min: defaultMin, 
          max: defaultMax 
        } 
      };
    }
    
    // Calculate time range with padding
    let minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
    let maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    
    // Add padding
    minDate = new Date(minDate);
    minDate.setMonth(minDate.getMonth() - 1);
    
    maxDate = new Date(maxDate);
    maxDate.setMonth(maxDate.getMonth() + 1);
    
    // Create Gantt bars
    const ganttBars = strategicItems
      .map((item, index) => {
        if (!item.implementationDate) return null;
        
        try {
          const implementationDate = new Date(item.implementationDate);
          
          // Skip items with invalid dates
          if (isNaN(implementationDate.getTime())) {
            return null;
          }
          
          // Calculate status and color
          const isPast = implementationDate < today;
          const isNear = !isPast && implementationDate < new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
          const status = isPast ? 'active' : (isNear ? 'urgent' : 'planned');
          const color = isPast ? '#10b981' : (isNear ? '#ef4444' : '#6366f1');
          
          // Added some randomization to y-position to avoid overlaps
          const yPos = index + 1;
          
          return {
            id: item.id,
            name: item.title,
            date: implementationDate,
            x: implementationDate.getTime(),
            y: yPos,
            z: 10, // Size indicator
            status,
            color,
            formattedDate: formatDate(item.implementationDate),
            description: item.strategicImpact || '',
            advantages: item.competitiveAdvantages || []
          };
        } catch (error) {
          console.error(`Error processing item ${item.title}:`, error);
          return null;
        }
      })
      .filter(Boolean);
    
    return { ganttBars, timeRange: { min: minDate, max: maxDate } };
  };
  
  const { ganttBars, timeRange } = prepareGanttData();
  
  // Generate a list of months for the chart
  const getMonthTickValues = () => {
    const { min, max } = timeRange;
    const tickValues = [];
    
    const currentDate = new Date(min);
    currentDate.setDate(1); // Start at the beginning of the month
    
    while (currentDate <= max) {
      tickValues.push(new Date(currentDate));
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return tickValues;
  };
  
  const monthTicks = getMonthTickValues();
  
  // Current date for reference line
  const today = new Date();

  // Custom shape for gantt items
  const CustomGanttBar = (props: any) => {
    const { x, y, width, height, fill, payload } = props;
    
    if (!payload) return null;
    
    const color = payload.color || fill;
    const barHeight = 18;
    
    return (
      <g>
        <Rectangle 
          x={x} 
          y={y - barHeight/2} 
          width={15} 
          height={barHeight} 
          fill={color} 
          rx={3} 
          ry={3} 
        />
        <text 
          x={x + 20} 
          y={y + 4} 
          textAnchor="start" 
          fill="#374151" 
          fontSize={12}
        >
          {payload.name}
        </text>
      </g>
    );
  };
  
  // Custom tooltip for Gantt chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-lg max-w-xs">
        <h3 className="font-medium mb-1">{data.name}</h3>
        <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>{data.formattedDate}</span>
          <span className="ml-1">
            {data.status === 'active' ? (
              <span className="flex items-center text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Действует
              </span>
            ) : data.status === 'urgent' ? (
              <span className="flex items-center text-red-500">
                <Clock1 className="h-3 w-3 mr-1" />
                Срочно
              </span>
            ) : (
              <span className="flex items-center text-indigo-500">
                <Clock1 className="h-3 w-3 mr-1" />
                Планируется
              </span>
            )}
          </span>
        </div>
        
        <Separator className="my-2" />
        
        <div className="text-xs mt-2">
          <p className="font-medium mb-1">Стратегическое влияние:</p>
          <p className="text-muted-foreground">{data.description}</p>
        </div>
        
        {data.advantages && data.advantages.length > 0 && (
          <div className="mt-2 text-xs">
            <p className="font-medium flex items-center mb-1">
              <TrendingUp className="h-3 w-3 mr-1 text-compGreen-500" />
              Преимущества:
            </p>
            <ul className="list-disc pl-4 space-y-0.5 text-muted-foreground">
              {data.advantages.map((adv: string, i: number) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-compGreen-500" />
            Стратегическая временная шкала
          </CardTitle>
          <Tabs defaultValue="gantt" onValueChange={(value) => setViewType(value as 'gantt' | 'vertical')}>
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="gantt">
                <BarChart3 className="h-4 w-4 mr-2" />
                <span>Диаграмма Ганта</span>
              </TabsTrigger>
              <TabsTrigger value="vertical">
                <List className="h-4 w-4 mr-2" />
                <span>Список</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {strategicItems.length > 0 ? (
          <>
            {viewType === 'gantt' ? (
              <div className="space-y-6">
                {/* Gantt Chart */}
                <div className="h-[400px] pt-6 overflow-x-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                      margin={{ top: 20, right: 30, bottom: 60, left: 120 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        domain={[timeRange.min.getTime(), timeRange.max.getTime()]} 
                        tickFormatter={(tick) => formatMonth(new Date(tick))}
                        ticks={monthTicks.map(date => date.getTime())}
                        angle={-30}
                        textAnchor="end"
                        height={60}
                        tick={{ dy: 20 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Task" 
                        tick={false}
                        axisLine={false}
                        tickLine={false}
                      />
                      <ZAxis 
                        type="number" 
                        dataKey="z" 
                        range={[100, 100]} 
                        domain={[0, 100]} 
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <ReferenceLine 
                        x={today.getTime()} 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        strokeDasharray="5 5"
                        label={{ 
                          value: 'Сегодня', 
                          position: 'insideTopRight', 
                          fill: '#ef4444', 
                          fontSize: 12,
                          offset: 10
                        }}
                      />
                      {ganttBars.map((item: any) => (
                        <ReferenceLine 
                          key={item.id}
                          y={item.y}
                          stroke="#E5E7EB"
                          strokeWidth={1}
                          ifOverflow="extendDomain"
                        />
                      ))}
                      {ganttBars.map((item: any) => (
                        <CustomGanttBar
                          key={item.id}
                          x={item.x}
                          y={item.y}
                          payload={item}
                        />
                      ))}
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex justify-center items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-compGreen-500 rounded-full"></div>
                    <span>Действующие</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                    <span>Внедрение в течение 90 дней</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 bg-indigo-500 rounded-full"></div>
                    <span>Планируемые</span>
                  </div>
                </div>
              </div>
            ) : (
              // Vertical Timeline View
              <div className="relative pl-8 border-l-2 border-dashed border-muted-foreground/30 space-y-8 py-2">
                {strategicItems.map((item, index) => (
                  <div key={item.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-10 w-5 h-5 rounded-full bg-compGreen-500 border-4 border-background flex items-center justify-center">
                      {index === 0 && <div className="w-2 h-2 rounded-full bg-white"></div>}
                    </div>
                    
                    {/* Content */}
                    <div className="bg-muted/40 rounded-lg p-4 hover:bg-muted/60 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">{item.title}</h3>
                        <Badge variant={
                          !item.implementationDate ? "outline" :
                          new Date(item.implementationDate) < new Date() ? "default" : 
                          new Date(item.implementationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? "destructive" : "outline"
                        }>
                          {!item.implementationDate ? "Без даты" :
                           new Date(item.implementationDate) < new Date() ? "Действует" : "Планируется"}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Срок внедрения: {formatDate(item.implementationDate)}</span>
                      </div>
                      
                      <div className="mb-3 text-sm">
                        <strong>Стратегическое влияние:</strong>
                        <p className="mt-1">{item.strategicImpact}</p>
                      </div>
                      
                      {item.competitiveAdvantages && item.competitiveAdvantages.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-compGreen-500" />
                            <span className="font-medium">Конкурентные преимущества</span>
                          </div>
                          <ul className="space-y-1 pl-6 list-disc text-sm">
                            {item.competitiveAdvantages.map((advantage, idx) => (
                              <li key={idx}>{advantage}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Flag className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Пока нет стратегически важных законодательных изменений.</p>
            <p className="text-sm">Добавьте стратегические данные к законодательным изменениям, чтобы они отображались на временной шкале.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LegislationTimeline;
