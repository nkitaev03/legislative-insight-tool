
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Palette, 
  Layout, 
  Bell, 
  Monitor, 
  PanelTop,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { DashboardWidget } from '@/types/dashboard';

const defaultWidgets: DashboardWidget[] = [
  { id: 'kpi-1', type: 'kpi', title: 'Ключевые показатели', size: 'medium', visible: true },
  { id: 'notifications-1', type: 'notifications', title: 'Уведомления', size: 'small', visible: true },
  { id: 'risk-report-1', type: 'riskReport', title: 'Отчет по рискам', size: 'large', visible: true },
  { id: 'compliance-1', type: 'complianceStatus', title: 'Статус соответствия', size: 'medium', visible: true },
  { id: 'changes-1', type: 'recentChanges', title: 'Последние изменения', size: 'small', visible: false },
  { id: 'deadlines-1', type: 'upcomingDeadlines', title: 'Предстоящие дедлайны', size: 'medium', visible: false },
];

// Font options for visual system
const fontOptions = [
  { label: 'Inter', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'SF Pro Display', value: 'SF Pro Display' },
];

// Color scheme options for visual system
const colorSchemeOptions = [
  { label: 'По умолчанию', value: 'default' },
  { label: 'Высококонтрастная', value: 'high-contrast' },
  { label: 'Зеленая', value: 'green' },
  { label: 'Синяя', value: 'blue' },
  { label: 'Фиолетовая', value: 'purple' },
];

const UserPreferences: React.FC = () => {
  const [activeTab, setActiveTab] = useState('визуализация');
  const [primaryFont, setPrimaryFont] = useState('Inter');
  const [colorScheme, setColorScheme] = useState('default');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [notifications, setNotifications] = useState(true);
  const [widgets, setWidgets] = useState<DashboardWidget[]>([]);
  const { toast: uiToast } = useToast();

  // Load user preferences from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('dashboardWidgets');
    const savedLayout = localStorage.getItem('dashboardLayout');
    const savedFont = localStorage.getItem('primaryFont');
    const savedColorScheme = localStorage.getItem('colorScheme');
    
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    } else {
      setWidgets(defaultWidgets);
    }
    
    if (savedLayout) {
      setLayoutMode(savedLayout);
    }
    
    if (savedFont) {
      setPrimaryFont(savedFont);
    }
    
    if (savedColorScheme) {
      setColorScheme(savedColorScheme);
    }
  }, []);

  const handleWidgetToggle = (widgetId: string) => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };

  const handleWidgetSizeChange = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    const updatedWidgets = widgets.map(widget => 
      widget.id === widgetId ? { ...widget, size } : widget
    );
    
    setWidgets(updatedWidgets);
    localStorage.setItem('dashboardWidgets', JSON.stringify(updatedWidgets));
  };

  const handleFontChange = (font: string) => {
    setPrimaryFont(font);
    localStorage.setItem('primaryFont', font);
    document.body.style.fontFamily = font;
  };

  const handleColorSchemeChange = (scheme: string) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    
    // In a real implementation, here we would apply different CSS variable values
    // based on the selected color scheme
    const root = document.documentElement;
    
    switch(scheme) {
      case 'high-contrast':
        root.style.setProperty('--primary', '210 100% 50%');
        break;
      case 'green':
        root.style.setProperty('--primary', '142 72% 50%');
        break;
      case 'blue':
        root.style.setProperty('--primary', '210 100% 50%');
        break;
      case 'purple':
        root.style.setProperty('--primary', '270 60% 50%');
        break;
      default:
        root.style.setProperty('--primary', '173 83% 50%');
        break;
    }
  };

  const handleLayoutChange = (layout: string) => {
    setLayoutMode(layout);
    localStorage.setItem('dashboardLayout', layout);
  };

  const resetVisualSettings = () => {
    setPrimaryFont('Inter');
    setColorScheme('default');
    
    localStorage.setItem('primaryFont', 'Inter');
    localStorage.setItem('colorScheme', 'default');
    
    document.body.style.fontFamily = 'Inter';
    document.documentElement.style.setProperty('--primary', '173 83% 50%');
    
    uiToast({
      title: "Настройки сброшены",
      description: "Визуальные настройки восстановлены по умолчанию"
    });
  };

  const savePreferences = () => {
    // In a real application, this would save to backend
    uiToast({
      title: "Настройки сохранены",
      description: "Ваши предпочтения успешно обновлены",
    });
    
    toast.success('Настройки пользователя обновлены', {
      description: 'Все изменения сохранены и применены',
      action: {
        label: 'Закрыть',
        onClick: () => console.log('Closed')
      }
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Пользовательские настройки</CardTitle>
        <CardDescription>
          Настройте внешний вид и функциональность платформы под свои потребности
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6">
            <TabsTrigger value="визуализация">
              <Palette className="mr-2 h-4 w-4" />
              Визуализация
            </TabsTrigger>
            <TabsTrigger value="дашборд">
              <Layout className="mr-2 h-4 w-4" />
              Дашборд
            </TabsTrigger>
            <TabsTrigger value="уведомления">
              <Bell className="mr-2 h-4 w-4" />
              Уведомления
            </TabsTrigger>
            <TabsTrigger value="модули">
              <PanelTop className="mr-2 h-4 w-4" />
              Модули
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="визуализация" className="space-y-4">
            <div className="grid gap-6">
              <div>
                <h3 className="text-lg font-medium mb-3">Визуальная система</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="font">Основной шрифт</Label>
                    <Select value={primaryFont} onValueChange={handleFontChange}>
                      <SelectTrigger id="font">
                        <SelectValue placeholder="Выберите шрифт" />
                      </SelectTrigger>
                      <SelectContent>
                        {fontOptions.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="pt-1">
                      <p className="text-sm text-muted-foreground">
                        Пример текста с выбранным шрифтом
                      </p>
                      <p className="mt-1 p-2 border rounded-md" style={{ fontFamily: primaryFont }}>
                        AaBbCcДдЕеЖж 1234567890
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Цветовая схема</Label>
                    <Select value={colorScheme} onValueChange={handleColorSchemeChange}>
                      <SelectTrigger id="colorScheme">
                        <SelectValue placeholder="Выберите цветовую схему" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorSchemeOptions.map(scheme => (
                          <SelectItem key={scheme.value} value={scheme.value}>
                            {scheme.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <div className="pt-1 flex gap-2">
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: 'hsl(var(--primary))' }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: 'hsl(var(--secondary))' }}
                      ></div>
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: 'hsl(var(--accent))' }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={resetVisualSettings}>
                    Сбросить визуальные настройки
                  </Button>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Интерактивные подсказки</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="tooltips" defaultChecked />
                    <Label htmlFor="tooltips">Показывать всплывающие подсказки</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="tour" defaultChecked />
                    <Label htmlFor="tour">Включить обучающий тур при первом входе</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="animations" defaultChecked />
                    <Label htmlFor="animations">Анимации интерфейса</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="дашборд" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Настройка виджетов</h3>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={layoutMode === 'grid' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleLayoutChange('grid')}
                  >
                    <Layout className="mr-2 h-4 w-4" />
                    Сетка
                  </Button>
                  <Button 
                    variant={layoutMode === 'list' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleLayoutChange('list')}
                  >
                    <PanelTop className="mr-2 h-4 w-4" />
                    Список
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                {widgets.map(widget => (
                  <div key={widget.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <Switch 
                          checked={widget.visible}
                          onCheckedChange={() => handleWidgetToggle(widget.id)}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-medium">{widget.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {widget.type === 'kpi' && 'Ключевые метрики'}
                            {widget.type === 'notifications' && 'Уведомления и оповещения'}
                            {widget.type === 'riskReport' && 'Аналитика рисков'}
                            {widget.type === 'complianceStatus' && 'Статус соответствия требованиям'}
                            {widget.type === 'recentChanges' && 'Недавние изменения в системе'}
                            {widget.type === 'upcomingDeadlines' && 'Предстоящие сроки и задачи'}
                          </p>
                        </div>
                      </div>
                      <Select 
                        value={widget.size} 
                        onValueChange={(val: any) => handleWidgetSizeChange(widget.id, val)}
                        disabled={!widget.visible}
                      >
                        <SelectTrigger className="w-28">
                          <SelectValue placeholder="Размер" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Малый</SelectItem>
                          <SelectItem value="medium">Средний</SelectItem>
                          <SelectItem value="large">Большой</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {widget.visible && (
                      <div className={`
                        grid gap-2 grid-cols-3 bg-muted/30 rounded-md p-2 mt-2 border border-dashed
                        ${widget.size === 'small' ? 'w-1/3' : widget.size === 'medium' ? 'w-2/3' : 'w-full'}
                      `}>
                        <div className="col-span-3 text-center text-xs text-muted-foreground">
                          Превью размера виджета ({widget.size})
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-4 text-sm text-muted-foreground">
                <Monitor className="inline-block mr-1 h-4 w-4" />
                Перетаскивание и изменение размеров виджетов доступно непосредственно на дашборде
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="уведомления">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push-уведомления</h3>
                  <p className="text-sm text-muted-foreground">Мгновенные уведомления в браузере</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>
              
              <div className="space-y-3 mt-4">
                <h4 className="font-medium">Частота уведомлений</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center space-x-2">
                    <Switch id="risk-alerts" defaultChecked />
                    <Label htmlFor="risk-alerts">Оповещения о рисках</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="legislation-updates" defaultChecked />
                    <Label htmlFor="legislation-updates">Изменения в законодательстве</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="deadline-reminders" defaultChecked />
                    <Label htmlFor="deadline-reminders">Напоминания о дедлайнах</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="compliance-issues" defaultChecked />
                    <Label htmlFor="compliance-issues">Проблемы с соответствием</Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="модули">
            <div className="space-y-4">
              <h3 className="font-medium">Настройка доступных модулей</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Выберите, какие модули будут доступны в навигации
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Switch id="monitoring-module" defaultChecked />
                  <Label htmlFor="monitoring-module">Мониторинг</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="simulation-module" defaultChecked />
                  <Label htmlFor="simulation-module">Симуляция</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="audit-module" defaultChecked />
                  <Label htmlFor="audit-module">Аудит</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="analytics-module" defaultChecked />
                  <Label htmlFor="analytics-module">Аналитика</Label>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={savePreferences} className="bg-primary hover:bg-primary/90">
            <Check className="mr-2 h-4 w-4" />
            Сохранить настройки
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
