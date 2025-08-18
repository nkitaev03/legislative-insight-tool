
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Bell, CheckCircle, Clock, User } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  deadline?: Date;
  reminders?: boolean;
  responsible?: string;
}

interface ChecklistProps {
  title?: string;
  description?: string;
  items: ChecklistItem[];
  compact?: boolean; // Added compact prop
}

const InteractiveChecklist: React.FC<ChecklistProps> = ({ 
  title = "Интерактивный чеклист", // Default title 
  description,
  items: initialItems,
  compact = false // Default value
}) => {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCheckChange = (id: string, checked: boolean) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: checked } : item
    ));

    if (checked) {
      toast({
        title: "Задача выполнена",
        description: "Отлично! Продолжайте в том же духе",
        className: "bg-compGreen-50 border-l-4 border-compGreen-500",
      });
    }
  };

  const handleDateChange = (id: string, date?: Date) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, deadline: date } : item
    ));
    setSelectedItemId(null);

    toast({
      title: "Дедлайн установлен",
      description: `Новый срок: ${date ? date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' }) : 'не задан'}`,
      className: "bg-compBlue-50 border-l-4 border-compBlue-500",
    });
  };

  const toggleReminder = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, reminders: !item.reminders } : item
    ));

    const item = items.find(i => i.id === id);
    if (item) {
      toast({
        title: item.reminders ? "Напоминания отключены" : "Напоминания включены",
        description: item.reminders 
          ? "Вы больше не будете получать уведомления об этой задаче" 
          : "Вы будете получать уведомления об этой задаче",
        className: item.reminders 
          ? "bg-muted border-l-4 border-muted-foreground"
          : "bg-compOrange-50 border-l-4 border-compOrange-500",
      });
    }
  };

  const getProgress = () => {
    const completed = items.filter(item => item.completed).length;
    const total = items.length;
    return {
      percent: total > 0 ? Math.round((completed / total) * 100) : 0,
      completed,
      total
    };
  };

  const progress = getProgress();

  return (
    <Card className="w-full">
      <CardHeader className={cn("pb-2", compact && "p-4")}>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className={cn("flex items-center", compact && "text-lg")}>
              {title}
              <Badge variant="outline" className="ml-2 bg-compBlue-50 text-compBlue-700">
                {progress.completed}/{progress.total}
              </Badge>
            </CardTitle>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{progress.percent}%</span>
            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-compGreen-500 transition-all duration-500 ease-out" 
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn(compact && "p-4 pt-0")}>
        <ul className="space-y-2">
          {items.map((item) => (
            <li 
              key={item.id}
              className={cn(
                "p-3 rounded-md flex items-start gap-3 transition-all duration-200",
                item.completed ? "bg-muted/50" : "bg-card hover:bg-accent/5",
                compact && "p-2"
              )}
            >
              <Checkbox 
                id={`check-${item.id}`}
                checked={item.completed}
                onCheckedChange={(checked) => handleCheckChange(item.id, !!checked)}
                className="mt-1"
              />
              <div className="flex-1">
                <label 
                  htmlFor={`check-${item.id}`}
                  className={cn(
                    "font-medium cursor-pointer",
                    item.completed && "line-through text-muted-foreground",
                    compact && "text-sm"
                  )}
                >
                  {item.text}
                </label>
                
                {/* Meta information - Hide details in compact mode */}
                {!compact && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {/* Deadline */}
                    <Popover open={selectedItemId === item.id} onOpenChange={(open) => !open && setSelectedItemId(null)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => setSelectedItemId(item.id)}
                        >
                          <Clock className="h-3 w-3" />
                          {item.deadline 
                            ? item.deadline.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
                            : "Установить срок"
                          }
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={item.deadline}
                          onSelect={(date) => handleDateChange(item.id, date)}
                        />
                      </PopoverContent>
                    </Popover>
                    
                    {/* Reminder toggle */}
                    <Button
                      variant={item.reminders ? "default" : "outline"}
                      size="sm"
                      className="h-7 gap-1 text-xs"
                      onClick={() => toggleReminder(item.id)}
                    >
                      <Bell className="h-3 w-3" />
                      {item.reminders ? "Уведомления включены" : "Напомнить"}
                    </Button>

                    {/* Responsible person */}
                    {item.responsible && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{item.responsible}</span>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Simple metadata for compact mode */}
                {compact && item.responsible && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    <span>{item.responsible}</span>
                    
                    {item.deadline && (
                      <>
                        <span className="mx-1">•</span>
                        <Clock className="h-3 w-3" />
                        <span>{item.deadline.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default InteractiveChecklist;
