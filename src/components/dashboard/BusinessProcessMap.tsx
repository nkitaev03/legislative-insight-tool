
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, FileText, User, Calendar, BarChart3, ShieldAlert, ArrowUpDown, TrendingUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProcessArea {
  id: string;
  name: string;
  risk: 'low' | 'medium' | 'high';
  x: number;
  y: number;
  width: number;
  height: number;
  description: string;
  icon: React.ReactNode;
  kpis: { name: string; value: string; trend: 'up' | 'down' | 'neutral' }[];
  history: {
    date: string;
    change: string;
    riskBefore?: 'low' | 'medium' | 'high';
    riskAfter?: 'low' | 'medium' | 'high';
  }[];
}

const processAreas: ProcessArea[] = [
  {
    id: 'finance',
    name: 'Финансовые операции',
    risk: 'high',
    x: 10,
    y: 10,
    width: 25,
    height: 35,
    icon: <BarChart3 className="h-6 w-6 text-white" />,
    description: 'Зона высокого риска, связанная с финансовым учетом и отчетностью. Необходимо тщательно отслеживать изменения в налоговом законодательстве.',
    kpis: [
      { name: 'Рентабельность', value: '16.4%', trend: 'up' },
      { name: 'Операц. расходы', value: '9.2M₽', trend: 'down' },
      { name: 'Налоговые риски', value: 'Высокие', trend: 'up' },
    ],
    history: [
      {
        date: '10.05.2023',
        change: 'Введены новые требования к налоговой отчетности',
        riskBefore: 'medium',
        riskAfter: 'high'
      },
      {
        date: '01.04.2023',
        change: 'Изменены сроки подачи квартальных отчетов',
        riskBefore: 'low',
        riskAfter: 'medium'
      }
    ]
  },
  {
    id: 'hr',
    name: 'Управление персоналом',
    risk: 'medium',
    x: 40,
    y: 10,
    width: 25,
    height: 20,
    icon: <User className="h-6 w-6 text-white" />,
    description: 'Зона связана с трудовым законодательством, наймом и увольнением сотрудников.',
    kpis: [
      { name: 'Текучесть', value: '7.2%', trend: 'down' },
      { name: 'Укомплектованность', value: '94%', trend: 'up' },
      { name: 'Соответствие ТК', value: 'Среднее', trend: 'neutral' },
    ],
    history: [
      {
        date: '15.04.2023',
        change: 'Обновление требований к охране труда',
        riskBefore: 'medium',
        riskAfter: 'medium'
      }
    ]
  },
  {
    id: 'operations',
    name: 'Операционная деятельность',
    risk: 'low',
    x: 10,
    y: 50,
    width: 30,
    height: 25,
    icon: <ArrowUpDown className="h-6 w-6 text-white" />,
    description: 'Зона связанная с повседневными операциями компании.',
    kpis: [
      { name: 'Эффективность', value: '87%', trend: 'up' },
      { name: 'Простои', value: '3.2%', trend: 'down' },
      { name: 'Соответствие KPI', value: 'Высокое', trend: 'up' },
    ],
    history: [
      {
        date: '20.03.2023',
        change: 'Внедрение новой системы документооборота',
        riskBefore: 'low',
        riskAfter: 'low'
      }
    ]
  },
  {
    id: 'legal',
    name: 'Юридическое соответствие',
    risk: 'high',
    x: 45,
    y: 35,
    width: 20,
    height: 40,
    icon: <ShieldAlert className="h-6 w-6 text-white" />,
    description: 'Зона высокого риска, связанная с соблюдением законодательных требований и нормативных актов.',
    kpis: [
      { name: 'Число нарушений', value: '3', trend: 'up' },
      { name: 'Судебные риски', value: 'Высокие', trend: 'up' },
      { name: 'Соотв. нормам', value: '72%', trend: 'down' },
    ],
    history: [
      {
        date: '05.05.2023',
        change: 'Существенное изменение в антимонопольном законодательстве',
        riskBefore: 'medium',
        riskAfter: 'high'
      }
    ]
  },
  {
    id: 'it',
    name: 'ИТ-безопасность',
    risk: 'medium',
    x: 70,
    y: 10,
    width: 20,
    height: 65,
    icon: <TrendingUp className="h-6 w-6 text-white" />,
    description: 'Зона, связанная с информационной безопасностью и защитой данных.',
    kpis: [
      { name: 'Надежность систем', value: '99.3%', trend: 'up' },
      { name: 'Инциденты', value: '2', trend: 'down' },
      { name: 'Уязвимости', value: '12', trend: 'down' },
    ],
    history: [
      {
        date: '25.04.2023',
        change: 'Новые требования к хранению персональных данных',
        riskBefore: 'low',
        riskAfter: 'medium'
      }
    ]
  }
];

const BusinessProcessMap: React.FC = () => {
  const [selectedArea, setSelectedArea] = useState<ProcessArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);
  const [processAreasWithAnimation, setProcessAreasWithAnimation] = useState<ProcessArea[]>(processAreas);
  
  // Add pulse animation to random areas
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Randomly decide which area to pulse
      const randomAreaIndex = Math.floor(Math.random() * processAreas.length);
      
      // Create a new array with the pulsing area
      setProcessAreasWithAnimation(prevAreas => {
        const newAreas = [...prevAreas];
        newAreas[randomAreaIndex] = {
          ...newAreas[randomAreaIndex],
          isPulsing: true
        } as ProcessArea & { isPulsing?: boolean };
        
        // Reset the previous pulse after 2 seconds
        setTimeout(() => {
          setProcessAreasWithAnimation(prevAreas => {
            const resetAreas = [...prevAreas];
            resetAreas[randomAreaIndex] = {
              ...resetAreas[randomAreaIndex],
              isPulsing: false
            } as ProcessArea & { isPulsing?: boolean };
            return resetAreas;
          });
        }, 2000);
        
        return newAreas;
      });
    }, 5000); // Pulse every 5 seconds
    
    return () => clearInterval(intervalId);
  }, []);
  
  const getRiskColor = (risk: 'low' | 'medium' | 'high', isHovered: boolean, isPulsing?: boolean) => {
    let baseClass = '';
    switch(risk) {
      case 'high': 
        baseClass = isHovered ? 'bg-red-500/70' : 'bg-red-500/40';
        break;
      case 'medium': 
        baseClass = isHovered ? 'bg-orange-500/70' : 'bg-orange-500/40';
        break;
      case 'low': 
        baseClass = isHovered ? 'bg-green-500/70' : 'bg-green-500/40';
        break;
    }
    
    const hoverClass = isHovered ? 'shadow-lg scale-105' : 'hover:shadow-lg hover:scale-105';
    const pulseClass = isPulsing ? 'animate-pulse shadow-lg' : '';
    
    return `${baseClass} ${hoverClass} ${pulseClass}`;
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'high': return <Badge className="bg-red-500">Высокий</Badge>;
      case 'medium': return <Badge className="bg-orange-500">Средний</Badge>;
      case 'low': return <Badge className="bg-green-500">Низкий</Badge>;
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === 'down') return <TrendingUp className="h-3 w-3 text-red-500 transform rotate-180" />;
    return <ArrowUpDown className="h-3 w-3 text-gray-500" />;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Карта бизнес-процессов</CardTitle>
        <CardDescription>
          Интерактивная карта бизнес-процессов компании с оценкой рисков и ключевыми показателями
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] border border-border rounded-lg overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
          {/* Connection lines between process areas */}
          <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none">
            <path d="M25 120 L95 120" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M95 120 L165 120" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M95 120 L95 195" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M165 120 L225 195" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M95 195 L225 195" stroke="rgba(100,116,139,0.2)" strokeWidth="2" strokeDasharray="5,5" />
            
            {/* Animated circle moving along paths */}
            <circle id="moving-circle" r="2" fill="#3b82f6">
              <animateMotion
                path="M25 120 L95 120 L165 120 L225 195 L95 195 L95 120"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>

          {processAreasWithAnimation.map((area, index) => (
            <div 
              key={area.id}
              style={{
                position: 'absolute',
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                zIndex: hoveredArea === area.id || (area as any).isPulsing ? 10 : 1
              }}
              className={`${getRiskColor(area.risk, hoveredArea === area.id, (area as any).isPulsing)} flex flex-col items-center justify-start shadow-md border border-border transform transition-transform duration-300`}
              onClick={() => setSelectedArea(area)}
              onMouseEnter={() => setHoveredArea(area.id)}
              onMouseLeave={() => setHoveredArea(null)}
            >
              <div className="text-center p-4 w-full">
                <div className="flex justify-center items-center mb-2">
                  <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    area.risk === 'high' ? 'bg-red-600' : 
                    area.risk === 'medium' ? 'bg-orange-600' : 
                    'bg-green-600'
                  }`}>
                    {area.icon}
                  </div>
                </div>
                <h3 className="font-medium text-sm mb-1">{area.name}</h3>
                <div className="mt-1 flex justify-center">
                  {getRiskBadge(area.risk)}
                </div>
                
                {(hoveredArea === area.id || area.height > 30) && (
                  <div className="mt-3 space-y-1">
                    {area.kpis.slice(0, area.height > 30 ? 3 : 1).map((kpi, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-white/80 dark:bg-slate-800/80 rounded px-2 py-1">
                        <span className="text-muted-foreground">{kpi.name}</span>
                        <div className="flex items-center">
                          <span className="font-medium mr-1">{kpi.value}</span>
                          {getTrendIcon(kpi.trend)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Floating badges with animated appearance */}
          <div className="absolute top-[32%] left-[32%] animate-fade-in">
            <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80">
              <ArrowUpDown className="h-3 w-3 mr-1" />
              Бизнес-процессы
            </Badge>
          </div>
          <div className="absolute bottom-[27%] right-[25%] animate-fade-in" style={{ animationDelay: "0.5s" }}>
            <Badge variant="outline" className="bg-white/80 dark:bg-slate-800/80">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Области риска
            </Badge>
          </div>
        </div>

        <Dialog open={!!selectedArea} onOpenChange={() => setSelectedArea(null)}>
          {selectedArea && (
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedArea.name}
                  {getRiskBadge(selectedArea.risk)}
                </DialogTitle>
                <DialogDescription>
                  {selectedArea.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedArea.kpis.map((kpi, idx) => (
                    <div key={idx} className="bg-muted/20 p-3 rounded-lg">
                      <div className="text-xs text-muted-foreground">{kpi.name}</div>
                      <div className="flex items-center mt-1">
                        <span className="text-lg font-medium mr-2">{kpi.value}</span>
                        {getTrendIcon(kpi.trend)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                    История изменений
                  </h3>
                  <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-4">
                      {selectedArea.history.map((event, idx) => (
                        <div 
                          key={idx} 
                          className="border-b border-border pb-3 last:border-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">{event.date}</span>
                            {event.riskBefore && event.riskAfter && (
                              <div className="flex items-center gap-2">
                                {getRiskBadge(event.riskBefore)}
                                <span className="text-xs">→</span>
                                {getRiskBadge(event.riskAfter)}
                              </div>
                            )}
                          </div>
                          <p className="mt-1">{event.change}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-1">
                    <FileText className="h-4 w-4" />
                    Отчет
                  </Button>
                  <Button variant="default" size="sm" className="gap-1">
                    <AlertTriangle className="h-4 w-4" />
                    Управление рисками
                  </Button>
                </div>
              </div>
            </DialogContent>
          )}
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default BusinessProcessMap;
