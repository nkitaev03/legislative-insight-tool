
import React, { useState } from 'react';
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
import { Clock, AlertTriangle, FileText, User, Calendar } from 'lucide-react';
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
    description: 'Зона высокого риска, связанная с финансовым учетом и отчетностью. Необходимо тщательно отслеживать изменения в налоговом законодательстве.',
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
    description: 'Зона связана с трудовым законодательством, наймом и увольнением сотрудников.',
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
    description: 'Зона связанная с повседневными операциями компании.',
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
    description: 'Зона высокого риска, связанная с соблюдением законодательных требований и нормативных актов.',
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
    description: 'Зона, связанная с информационной безопасностью и защитой данных.',
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
  
  const getRiskColor = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'high': return 'bg-red-500/40 hover:bg-red-500/60';
      case 'medium': return 'bg-orange-500/40 hover:bg-orange-500/60';
      case 'low': return 'bg-green-500/40 hover:bg-green-500/60';
    }
  };

  const getRiskBadge = (risk: 'low' | 'medium' | 'high') => {
    switch(risk) {
      case 'high': return <Badge className="bg-red-500">Высокий</Badge>;
      case 'medium': return <Badge className="bg-orange-500">Средний</Badge>;
      case 'low': return <Badge className="bg-green-500">Низкий</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Карта бизнес-процессов</CardTitle>
        <CardDescription>
          Кликните на область для просмотра деталей и истории изменений
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[400px] border border-border rounded-lg overflow-hidden bg-muted/20">
          {processAreas.map(area => (
            <div 
              key={area.id}
              style={{
                position: 'absolute',
                left: `${area.x}%`,
                top: `${area.y}%`,
                width: `${area.width}%`,
                height: `${area.height}%`,
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              className={`${getRiskColor(area.risk)} flex items-center justify-center shadow-md border border-border`}
              onClick={() => setSelectedArea(area)}
            >
              <div className="text-center p-2 font-medium text-sm">
                {area.name}
                <div className="mt-2 flex justify-center">
                  {getRiskBadge(area.risk)}
                </div>
              </div>
            </div>
          ))}
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
