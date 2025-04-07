
import React, { useState } from 'react';
import { AlertTriangle, Check, Info, FileText } from 'lucide-react';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import RiskIndicator from '@/components/common/RiskIndicator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter 
} from '@/components/ui/dialog';

interface Risk {
  id: string;
  title: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  category: string;
  mitigation: string;
}

interface Action {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
  assignedTo?: string;
}

interface RiskAnalysisCardProps {
  title: string;
  score: number;
  scoreLabel: string;
  description: string;
  risks: Risk[];
  actions: Action[];
  className?: string;
}

export default function RiskAnalysisCard({
  title,
  score,
  scoreLabel,
  description,
  risks,
  actions,
  className
}: RiskAnalysisCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  const getRiskLevel = (score: number): 'low' | 'medium' | 'high' => {
    if (score >= 80) return 'low';
    if (score >= 65) return 'medium';
    return 'high';
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'bg-compGreen-500';
    if (score >= 65) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <>
      <Card className={`hover:shadow-md transition-shadow ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            <div className={`h-12 w-12 ${getScoreColor(score)} rounded-full flex items-center justify-center`}>
              <span className="text-lg font-bold text-white">{score}%</span>
            </div>
          </div>
          <CardDescription>{scoreLabel}</CardDescription>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-muted-foreground mb-2">{description}</p>
          
          <div className="space-y-2">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="issues">
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center">
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                    <span>Выявленные риски ({risks.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-6 text-sm">
                    {risks.slice(0, 2).map((risk) => (
                      <li key={risk.id} className="flex items-start">
                        <RiskIndicator level={risk.impact} size="sm" className="mt-1 mr-2" />
                        <span>{risk.title}</span>
                      </li>
                    ))}
                    {risks.length > 2 && (
                      <li className="text-xs text-muted-foreground italic">
                        ...и еще {risks.length - 2} {risks.length - 2 === 1 ? 'риск' : 'рисков'}
                      </li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="actions">
                <AccordionTrigger className="text-sm py-2">
                  <div className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-compGreen-500" />
                    <span>Рекомендуемые действия ({actions.length})</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2 pl-6 text-sm">
                    {actions.slice(0, 2).map((action) => (
                      <li key={action.id}>
                        {action.title}
                        {action.status === 'completed' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-compGreen-100 text-compGreen-800">
                            <Check className="h-3 w-3 mr-1" /> Выполнено
                          </span>
                        )}
                      </li>
                    ))}
                    {actions.length > 2 && (
                      <li className="text-xs text-muted-foreground italic">
                        ...и еще {actions.length - 2} {actions.length - 2 === 1 ? 'действие' : 'действий'}
                      </li>
                    )}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full" 
            onClick={() => setIsDetailsOpen(true)}
          >
            <FileText className="h-4 w-4 mr-2" />
            Подробный анализ
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <span className={`h-8 w-8 ${getScoreColor(score)} rounded-full flex items-center justify-center mr-2`}>
                <span className="text-sm font-bold text-white">{score}%</span>
              </span>
              Детальный анализ: {title}
            </DialogTitle>
            <DialogDescription>
              {description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-medium mb-3">Выявленные риски</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {risks.map((risk) => (
                  <Card key={risk.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-md font-medium">{risk.title}</CardTitle>
                        <RiskIndicator level={risk.impact} showLabel={true} />
                      </div>
                      <CardDescription>Категория: {risk.category}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm">{risk.description}</p>
                      <div className="mt-2 pt-2 border-t">
                        <h4 className="text-sm font-medium mb-1">Рекомендации по снижению:</h4>
                        <p className="text-sm">{risk.mitigation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Рекомендуемые действия</h3>
              <div className="space-y-2">
                {actions.map((action) => (
                  <div key={action.id} className="flex items-start p-3 bg-muted rounded-md">
                    <div className="mr-3 mt-1">
                      {action.status === 'completed' ? (
                        <div className="h-5 w-5 rounded-full bg-compGreen-500 flex items-center justify-center">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      ) : action.status === 'in-progress' ? (
                        <div className="h-5 w-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">{action.title}</h4>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      {(action.dueDate || action.assignedTo) && (
                        <div className="mt-1 flex flex-wrap gap-2">
                          {action.dueDate && (
                            <span className="text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                              Срок: {action.dueDate}
                            </span>
                          )}
                          {action.assignedTo && (
                            <span className="text-xs bg-muted-foreground/20 px-2 py-0.5 rounded-full">
                              Ответственный: {action.assignedTo}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="ml-2">
                      {action.status === 'completed' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-compGreen-100 text-compGreen-800">
                          Выполнено
                        </span>
                      ) : action.status === 'in-progress' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                          В процессе
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          Ожидает
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <h3 className="text-md font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                Общие рекомендации
              </h3>
              <p className="text-sm">
                Для повышения общей оценки соответствия в области "{title}" рекомендуется обратить внимание на следующие аспекты:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>Регулярный мониторинг нормативно-правовой базы и трендов в отрасли</li>
                <li>Обучение персонала и повышение квалификации</li>
                <li>Разработка и внедрение политик и процедур в соответствии с лучшими практиками</li>
                <li>Выполнение рекомендуемых действий в установленные сроки</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button 
              onClick={() => setIsDetailsOpen(false)} 
              className="w-full sm:w-auto"
            >
              Закрыть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
