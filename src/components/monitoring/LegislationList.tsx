
import React from 'react';
import { AlertCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import RiskIndicator from '../common/RiskIndicator';
import { ItemListProps } from './types';

const LegislationList: React.FC<ItemListProps> = ({
  items,
  onOpenDialog,
  onEditResponsible,
  editResponsibleId,
  handleResponsibleChange,
  responsiblePersons
}) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className={item.isNew ? 'border-l-4 border-l-compOrange-500' : ''}>
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-lg flex items-center gap-2">
                    {item.title}
                    {item.isNew && (
                      <Badge variant="outline" className="text-xs bg-compOrange-50 text-compOrange-700 border-compOrange-200">
                        Новое
                      </Badge>
                    )}
                  </h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    От {item.date} • {item.source}
                  </div>
                </div>
                <RiskIndicator level={item.risk as 'low' | 'medium' | 'high'} showLabel />
              </div>
              <p className="text-sm mt-3">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2 items-center">
                <Badge variant="secondary">{item.category}</Badge>
                
                {/* Responsible Person with inline edit functionality */}
                <div className="flex items-center gap-1 ml-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  
                  {editResponsibleId === item.id ? (
                    <Select 
                      value={item.responsible} 
                      onValueChange={(value) => handleResponsibleChange(item.id, value)}
                      onOpenChange={(open) => {
                        if (!open) onEditResponsible(null);
                      }}
                    >
                      <SelectTrigger className="h-7 text-xs w-[250px]">
                        <SelectValue placeholder="Выберите ответственного" />
                      </SelectTrigger>
                      <SelectContent>
                        {responsiblePersons.map(person => (
                          <SelectItem key={person} value={person}>{person}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span 
                      className="text-sm text-muted-foreground cursor-pointer hover:text-foreground hover:underline"
                      onClick={() => onEditResponsible(item.id)}
                    >
                      {item.responsible || "Назначить ответственного"}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div className="p-3 flex justify-end gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onOpenDialog(item.id)}
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Подробнее
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default LegislationList;
