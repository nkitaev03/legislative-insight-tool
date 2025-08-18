import React from 'react';
import { Scale, User, Building, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemListProps } from './types';

const LegislationList: React.FC<ItemListProps> = ({
  items,
  onOpenDialog,
  onEditResponsible,
  editResponsibleId,
  handleResponsibleChange,
  responsiblePersons
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'персональные данные':
        return <User className="w-4 h-4" />;
      case 'трудовое право':
        return <Building className="w-4 h-4" />;
      case 'налоговое право':
        return <Scale className="w-4 h-4" />;
      case 'техническое регулирование':
        return <Gavel className="w-4 h-4" />;
      case 'торговля':
        return <Building className="w-4 h-4" />;
      default:
        return <Scale className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className="bg-background border border-border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onOpenDialog(item.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Category with icon */}
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-md">
                  {getCategoryIcon(item.category)}
                </div>
                <span className="text-sm text-compBlue-600 font-medium">
                  Законодательство
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-compOrange-600 font-medium">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-foreground mb-2 leading-tight">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {item.description}
              </p>

              {/* Action button */}
              <Button 
                variant="outline" 
                size="sm" 
                className="text-compBlue-600 border-compBlue-200 hover:bg-compBlue-50"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDialog(item.id);
                }}
              >
                Принять меры →
              </Button>
            </div>

            {/* Date */}
            <div className="text-right ml-6">
              <div className="text-sm text-muted-foreground">
                {formatDate(item.date)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LegislationList;