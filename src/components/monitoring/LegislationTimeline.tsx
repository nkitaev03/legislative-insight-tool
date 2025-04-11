
import React, { useState } from 'react';
import { Calendar, Flag, Target, TrendingUp, BarChart, List, ArrowRight, Clock, CheckCircle, Clock1 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LegislationItem } from './types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  Bar, 
  BarChart as RechartsBarChart, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid
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

// Calculate relative position on timeline
const calculateTimelinePosition = (date: Date, minDate: Date, maxDate: Date): number => {
  const range = maxDate.getTime() - minDate.getTime();
  const position = date.getTime() - minDate.getTime();
  return range === 0 ? 50 : (position / range) * 100;
};

const LegislationTimeline: React.FC<LegislationTimelineProps> = ({ items }) => {
  const [viewType, setViewType] = useState<'horizontal' | 'vertical'>('horizontal');
  
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

  // Prepare data for the horizontal timeline chart
  const prepareChartData = () => {
    if (strategicItems.length === 0) return [];
    
    const now = new Date();
    
    return strategicItems.map(item => {
      // Handle potential invalid implementation dates
      if (!item.implementationDate) {
        return null;
      }
      
      try {
        const implementationDate = new Date(item.implementationDate);
        
        // Skip items with invalid dates
        if (isNaN(implementationDate.getTime())) {
          console.warn(`Skipping item with invalid date: ${item.title}`);
          return null;
        }
        
        const isPast = implementationDate < now;
        const isNear = !isPast && implementationDate < new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        
        return {
          name: item.title,
          id: item.id,
          date: implementationDate,
          formattedDate: formatDate(item.implementationDate),
          value: 1, // For chart display
          fill: isPast ? '#10b981' : isNear ? '#ef4444' : '#6366f1',
          status: isPast ? 'active' : 'planned',
          description: item.strategicImpact || '',
          advantages: item.competitiveAdvantages || []
        };
      } catch (error) {
        console.error(`Error processing item ${item.title}:`, error);
        return null;
      }
    }).filter(Boolean); // Remove null entries
  };
  
  const chartData = prepareChartData();
  
  // Calculate timeline min/max dates with padding
  const getTimelineBounds = () => {
    if (strategicItems.length === 0) {
      return { min: new Date(), max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
    }
    
    // Filter out invalid dates first
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
    
    // If no valid dates, return default range
    if (validDates.length === 0) {
      return { min: new Date(), max: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) };
    }
    
    const minDate = new Date(Math.min(...validDates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...validDates.map(d => d.getTime())));
    
    // Add padding (30 days before first and after last)
    minDate.setDate(minDate.getDate() - 30);
    maxDate.setDate(maxDate.getDate() + 30);
    
    return { min: minDate, max: maxDate };
  };
  
  const { min: minDate, max: maxDate } = getTimelineBounds();

  // Current date for reference line
  const today = new Date();
  
  // Chart configuration with colors for different states
  const chartConfig = {
    active: {
      label: "Действующие",
      color: "#10b981" // green
    },
    planned: {
      label: "Планируемые",
      color: "#6366f1" // indigo
    },
    urgent: {
      label: "Срочные",
      color: "#ef4444" // red
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-compGreen-500" />
            Стратегическая временная шкала
          </CardTitle>
          <Tabs defaultValue="horizontal" onValueChange={(value) => setViewType(value as 'horizontal' | 'vertical')}>
            <TabsList className="grid grid-cols-2 w-[200px]">
              <TabsTrigger value="horizontal">
                <BarChart className="h-4 w-4 mr-2" />
                <span>Линейная</span>
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
            {viewType === 'horizontal' ? (
              <div className="space-y-6">
                {/* Horizontal Timeline Chart */}
                <div className="h-[320px] pt-6">
                  <ChartContainer config={chartConfig}>
                    <RechartsBarChart 
                      data={chartData}
                      layout="vertical"
                      barCategoryGap={8}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                      <XAxis 
                        type="number" 
                        domain={[minDate.getTime(), maxDate.getTime()]} 
                        tickFormatter={(value) => {
                          return formatDate(new Date(value).toISOString());
                        }}
                        dataKey="date"
                        scale="time"
                        tickCount={5}
                        angle={-30}
                        textAnchor="end"
                        height={80}
                        tick={{ dy: 20 }}
                      />
                      <YAxis 
                        type="category" 
                        dataKey="name" 
                        width={150}
                        tick={{ fontSize: 12 }}
                      />
                      <ReferenceLine 
                        x={today.getTime()} 
                        stroke="#ef4444" 
                        strokeWidth={2} 
                        strokeDasharray="3 3"
                        label={{ value: 'Сегодня', position: 'insideTopRight', fill: '#ef4444', fontSize: 12 }}
                      />
                      <Bar 
                        dataKey="value" 
                        shape={<CustomBarShape />}
                        background={{ fill: "#f3f4f6" }}
                      />
                      <ChartTooltip 
                        content={
                          <CustomTooltip />
                        } 
                      />
                    </RechartsBarChart>
                  </ChartContainer>
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
                        <Calendar className="h-4 w-4" />
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

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      name: string;
      formattedDate: string;
      status: string;
      description: string;
      advantages: string[];
    }
  }>;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

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

// Custom bar shape for the timeline
const CustomBarShape = (props: any) => {
  const { x, y, width, height, fill, payload } = props;
  
  // Use the fill from the payload if available, otherwise fall back to the default fill
  const barFill = payload?.fill || fill;
  
  return (
    <g>
      <rect x={x} y={y + height/2 - 8} width={width} height={16} fill={barFill} rx={8} ry={8} />
      <circle cx={x} cy={y + height/2} r={6} fill={barFill} />
      <circle cx={x + width} cy={y + height/2} r={6} fill={barFill} />
    </g>
  );
};

// No longer needed with our updated approach

export default LegislationTimeline;
