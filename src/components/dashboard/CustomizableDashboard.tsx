
import React, { useState, useEffect } from 'react';
import { DashboardWidget, WidgetSize } from '@/types/dashboard';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { LayoutGrid, LayoutList, Plus, X, Move, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

// Widgets
import KpiWidget from './widgets/KpiWidget';
import NotificationsWidget from './widgets/NotificationsWidget';
import RiskReportWidget from './widgets/RiskReportWidget';
import ComplianceStatusWidget from './widgets/ComplianceStatusWidget';
import RecentChangesWidget from './widgets/RecentChangesWidget';
import UpcomingDeadlinesWidget from './widgets/UpcomingDeadlinesWidget';

// Define default widgets
const defaultWidgets: DashboardWidget[] = [
  { id: 'kpi-1', type: 'kpi', title: 'Ключевые показатели', size: 'medium', visible: true },
  { id: 'notifications-1', type: 'notifications', title: 'Уведомления', size: 'small', visible: true },
  { id: 'risk-report-1', type: 'riskReport', title: 'Отчет по рискам', size: 'large', visible: true },
  { id: 'compliance-1', type: 'complianceStatus', title: 'Статус соответствия', size: 'medium', visible: true },
  { id: 'changes-1', type: 'recentChanges', title: 'Последние изменения', size: 'small', visible: false },
  { id: 'deadlines-1', type: 'upcomingDeadlines', title: 'Предстоящие дедлайны', size: 'medium', visible: false },
];

const CustomizableDashboard: React.FC = () => {
  // State for widgets and layout
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  // Load widgets from localStorage on mount
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    const savedLayout = localStorage.getItem('dashboardLayout');
    
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
    }
    
    if (savedLayout) {
      setLayout(savedLayout as 'grid' | 'list');
    }
  }, []);

  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashboardWidgets', JSON.stringify(widgets));
    }
  }, [widgets]);

  // Save layout to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('dashboardLayout', layout);
  }, [layout]);

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    ));
    toast.success('Настройки панели обновлены');
  };

  // Change widget size
  const changeWidgetSize = (widgetId: string) => {
    setWidgets(widgets.map(widget => {
      if (widget.id === widgetId) {
        const sizes: WidgetSize[] = ['small', 'medium', 'large'];
        const currentIndex = sizes.indexOf(widget.size);
        const nextSize = sizes[(currentIndex + 1) % sizes.length];
        return { ...widget, size: nextSize };
      }
      return widget;
    }));
  };

  // Handle drag start
  const handleDragStart = (widgetId: string) => {
    setDraggedWidget(widgetId);
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, isDragging: true } : w
    ));
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (!draggedWidget || draggedWidget === targetId) return;
    
    const draggedIndex = widgets.findIndex(w => w.id === draggedWidget);
    const targetIndex = widgets.findIndex(w => w.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;
    
    const newWidgets = [...widgets];
    const [draggedItem] = newWidgets.splice(draggedIndex, 1);
    draggedItem.isDragging = false;
    newWidgets.splice(targetIndex, 0, draggedItem);
    
    setWidgets(newWidgets);
    setDraggedWidget(null);
    toast.success('Порядок виджетов изменен');
  };

  // Handle drag end
  const handleDragEnd = () => {
    setDraggedWidget(null);
    setWidgets(widgets.map(w => w.isDragging ? { ...w, isDragging: false } : w));
  };

  // Reset to defaults
  const resetToDefaults = () => {
    setWidgets(defaultWidgets);
    setLayout('grid');
    toast.success('Восстановлены настройки по умолчанию');
  };

  // Render widget based on type
  const renderWidget = (widget: DashboardWidget) => {
    if (!widget.visible) return null;

    // Define widget classes based on size
    const sizeClasses = {
      small: 'col-span-1',
      medium: 'col-span-2',
      large: 'col-span-3',
    };

    const widgetClass = layout === 'grid' 
      ? `${sizeClasses[widget.size]} transition-all duration-300` 
      : 'w-full mb-4';

    // Render different widgets based on type
    return (
      <div 
        key={widget.id}
        className={`${widgetClass} ${widget.isDragging ? 'opacity-50' : 'opacity-100'}`}
        draggable={isCustomizing}
        onDragStart={() => handleDragStart(widget.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, widget.id)}
        onDragEnd={handleDragEnd}
      >
        <Card className="h-full relative hover-card hover-card-lift">
          {isCustomizing && (
            <div className="absolute top-2 right-2 z-10 flex space-x-1">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => changeWidgetSize(widget.id)}
              >
                {widget.size === 'small' ? (
                  <Maximize2 className="h-3 w-3" />
                ) : widget.size === 'large' ? (
                  <Minimize2 className="h-3 w-3" />
                ) : (
                  <Maximize2 className="h-3 w-3" />
                )}
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
              >
                <Move className="h-3 w-3 cursor-grab" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm"
                onClick={() => toggleWidgetVisibility(widget.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          {widget.type === 'kpi' && <KpiWidget />}
          {widget.type === 'notifications' && <NotificationsWidget />}
          {widget.type === 'riskReport' && <RiskReportWidget />}
          {widget.type === 'complianceStatus' && <ComplianceStatusWidget />}
          {widget.type === 'recentChanges' && <RecentChangesWidget />}
          {widget.type === 'upcomingDeadlines' && <UpcomingDeadlinesWidget />}
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Панель управления</h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout('grid')}
            className={layout === 'grid' ? 'bg-primary text-primary-foreground' : ''}
          >
            <LayoutGrid className="h-4 w-4 mr-1" />
            Сетка
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLayout('list')}
            className={layout === 'list' ? 'bg-primary text-primary-foreground' : ''}
          >
            <LayoutList className="h-4 w-4 mr-1" />
            Список
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                Настроить
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Настройка панели управления</DialogTitle>
              </DialogHeader>
              
              <div className="py-4">
                <h3 className="font-medium mb-2">Доступные виджеты</h3>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {defaultWidgets.map(widget => (
                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{widget.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {widget.size === 'small' ? 'Маленький' : 
                           widget.size === 'medium' ? 'Средний' : 'Большой'}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id={`widget-${widget.id}`}
                            checked={widgets.find(w => w.id === widget.id)?.visible || false}
                            onCheckedChange={() => toggleWidgetVisibility(widget.id)}
                          />
                          <Label htmlFor={`widget-${widget.id}`}>
                            {widgets.find(w => w.id === widget.id)?.visible ? 'Показать' : 'Скрыть'}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Для изменения позиции виджетов, включите режим настройки на дашборде
                  </p>
                  <Button variant="outline" onClick={resetToDefaults}>Сбросить настройки</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={isCustomizing ? "default" : "outline"}
            size="sm"
            onClick={() => setIsCustomizing(!isCustomizing)}
          >
            {isCustomizing ? 'Готово' : 'Редактировать'}
          </Button>
        </div>
      </div>
      
      {isCustomizing && (
        <div className="bg-muted p-3 rounded-lg text-sm flex items-center">
          <span className="text-muted-foreground">
            Режим редактирования: перетаскивайте виджеты, меняйте их размер или удаляйте
          </span>
        </div>
      )}
      
      <div className={layout === 'grid' ? 'grid grid-cols-3 gap-4' : 'space-y-4'}>
        {widgets.filter(w => w.visible).map(renderWidget)}
        
        {isCustomizing && (
          <Dialog>
            <DialogTrigger asChild>
              <div className={layout === 'grid' ? 'col-span-1' : 'w-full'}>
                <div className="widget-placeholder h-40 flex flex-col items-center justify-center cursor-pointer">
                  <Plus className="h-8 w-8 text-primary/50 mb-2" />
                  <span className="text-sm font-medium text-muted-foreground">Добавить виджет</span>
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить виджет</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-3">
                  {widgets.filter(w => !w.visible).map(widget => (
                    <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{widget.title}</h4>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          toggleWidgetVisibility(widget.id);
                        }}
                      >
                        Добавить
                      </Button>
                    </div>
                  ))}
                  
                  {widgets.filter(w => !w.visible).length === 0 && (
                    <p className="text-center py-4 text-muted-foreground">
                      Все доступные виджеты уже добавлены на дашборд
                    </p>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default CustomizableDashboard;
