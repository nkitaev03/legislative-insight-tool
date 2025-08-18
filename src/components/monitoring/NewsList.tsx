import React from 'react';
import { Newspaper, TrendingUp, Building, DollarSign, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ItemListProps } from './types';

const NewsList: React.FC<ItemListProps> = ({
  items,
  onOpenDialog,
  onEditResponsible,
  editResponsibleId,
  handleResponsibleChange,
  responsiblePersons
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'экономика':
        return <TrendingUp className="w-4 h-4" />;
      case 'энергетика':
        return <Zap className="w-4 h-4" />;
      case 'экология':
        return <Building className="w-4 h-4" />;
      case 'финансы':
        return <DollarSign className="w-4 h-4" />;
      default:
        return <Newspaper className="w-4 h-4" />;
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
                <div className="p-1.5 bg-compOrange-50 dark:bg-compOrange-900/20 rounded-md">
                  {getCategoryIcon(item.category)}
                </div>
                <span className="text-sm text-compOrange-600 font-medium">
                  Новости
                </span>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-compBlue-600 font-medium">
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

export default NewsList;