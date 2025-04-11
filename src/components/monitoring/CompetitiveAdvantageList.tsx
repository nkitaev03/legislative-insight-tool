
import React from 'react';
import { TrendingUp, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LegislationItem } from './types';

interface CompetitiveAdvantageListProps {
  items: LegislationItem[];
  onOpenDialog: (id: string) => void;
}

const CompetitiveAdvantageList: React.FC<CompetitiveAdvantageListProps> = ({ items, onOpenDialog }) => {
  // Filter items with competitive advantages
  const itemsWithAdvantages = items.filter(
    item => item.competitiveAdvantages && item.competitiveAdvantages.length > 0
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-compGreen-500" />
          Потенциальные конкурентные преимущества
        </CardTitle>
      </CardHeader>
      <CardContent>
        {itemsWithAdvantages.length > 0 ? (
          <div className="space-y-4">
            {itemsWithAdvantages.map((item) => (
              <Card key={item.id} className="overflow-hidden border-l-4 border-l-compGreen-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant="secondary" className="ml-2">
                      {item.category}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mb-3">
                    От {item.date} • {item.source}
                  </div>
                  
                  <div className="bg-compGreen-50 border border-compGreen-100 rounded-md p-3 mb-3">
                    <h4 className="font-medium flex items-center gap-2 text-compGreen-700 mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Конкурентные преимущества
                    </h4>
                    <ul className="space-y-1 pl-5 list-disc text-sm text-compGreen-800">
                      {item.competitiveAdvantages.map((advantage, idx) => (
                        <li key={idx}>{advantage}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onOpenDialog(item.id)}
                      className="text-xs"
                    >
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <TrendingUp className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>Пока не выявлено потенциальных конкурентных преимуществ.</p>
            <p className="text-sm">Добавьте данные о конкурентных преимуществах к законодательным изменениям, чтобы они отображались в этом разделе.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompetitiveAdvantageList;
