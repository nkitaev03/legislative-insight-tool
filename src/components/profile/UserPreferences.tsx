
import React, { useState } from 'react';
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
  PanelTop 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DashboardWidget } from '@/types/dashboard';

const defaultWidgets: DashboardWidget[] = [
  { id: 'kpi-1', type: 'kpi', title: 'Ключевые показатели', size: 'medium', visible: true },
  { id: 'notifications-1', type: 'notifications', title: 'Уведомления', size: 'small', visible: true },
  { id: 'risk-report-1', type: 'riskReport', title: 'Отчет по рискам', size: 'large', visible: true },
  { id: 'compliance-1', type: 'complianceStatus', title: 'Статус соответствия', size: 'medium', visible: true },
  { id: 'changes-1', type: 'recentChanges', title: 'Последние изменения', size: 'small', visible: false },
  { id: 'deadlines-1', type: 'upcomingDeadlines', title: 'Предстоящие дедлайны', size: 'medium', visible: false },
];

const UserPreferences: React.FC = () => {
  const [activeTab, setActiveTab] = useState('визуализация');
  const [primaryFont, setPrimaryFont] = useState('Roboto');
  const [colorScheme, setColorScheme] = useState('default');
  const [layoutMode, setLayoutMode] = useState('grid');
  const [notifications, setNotifications] = useState(true);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const { toast } = useToast();

  const handleWidgetToggle = (widgetId: string) => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    ));
  };

  const handleWidgetSizeChange = (widgetId: string, size: 'small' | 'medium' | 'large') => {
    setWidgets(widgets.map(widget => 
      widget.id === widgetId ? { ...widget, size } : widget
    ));
  };

  const savePreferences = () => {
    // In a real application, this would save to backend or localStorage
    toast({
      title: "Настройки сохранены",
      description: "Ваши предпочтения успешно обновлены",
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
                    <Select value={primaryFont} onValueChange={setPrimaryFont}>
                      <SelectTrigger id="font">
                        <SelectValue placeholder="Выберите шрифт" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="colorScheme">Цветовая схема</Label>
                    <Select value={colorScheme} onValueChange={setColorScheme}>
                      <SelectTrigger id="colorScheme">
                        <SelectValue placeholder="Выберите цветовую схему" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">По умолчанию</SelectItem>
                        <SelectItem value="contrast">Высококонтрастная</SelectItem>
                        <SelectItem value="warm">Теплая</SelectItem>
                        <SelectItem value="cool">Холодная</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Интерактивные подсказки</h3>
                <div className="flex items-center space-x-2">
                  <Switch id="tooltips" defaultChecked />
                  <Label htmlFor="tooltips">Показывать всплывающие подсказки</Label>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Switch id="tour" defaultChecked />
                  <Label htmlFor="tour">Включить обучающий тур при первом входе</Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="дашборд" className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Настройка виджетов</h3>
                <Select value={layoutMode} onValueChange={setLayoutMode}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Вид" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Сетка</SelectItem>
                    <SelectItem value="list">Список</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-4">
                {widgets.map(widget => (
                  <div key={widget.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center">
                      <Switch 
                        checked={widget.visible}
                        onCheckedChange={() => handleWidgetToggle(widget.id)}
                        className="mr-3"
                      />
                      <span>{widget.title}</span>
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
          <Button onClick={savePreferences}>Сохранить настройки</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPreferences;
