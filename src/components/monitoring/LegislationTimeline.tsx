
import React from 'react';
import { Calendar, Flag, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LegislationItem } from './types';

interface LegislationTimelineProps {
  items: LegislationItem[];
}

const LegislationTimeline: React.FC<LegislationTimelineProps> = ({ items }) => {
  // Filter items with strategic impact and sort by implementation date
  const strategicItems = items
    .filter(item => item.strategicImpact && item.implementationDate)
    .sort((a, b) => {
      const dateA = new Date(a.implementationDate);
      const dateB = new Date(b.implementationDate);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-compGreen-500" />
          Стратегическая временная шкала
        </CardTitle>
      </CardHeader>
      <CardContent>
        {strategicItems.length > 0 ? (
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
                      new Date(item.implementationDate) < new Date() ? "default" : 
                      new Date(item.implementationDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? "destructive" : "outline"
                    }>
                      {new Date(item.implementationDate) < new Date() ? "Действует" : "Планируется"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Срок внедрения: {item.implementationDate}</span>
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
