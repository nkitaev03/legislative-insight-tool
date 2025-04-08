
import { useState } from 'react';
import {
  ArrowUpRight
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BusinessProcessMap from './BusinessProcessMap';
import CustomizableDashboard from './CustomizableDashboard';

export default function DashboardPage() {
  const [tab, setTab] = useState('overview');

  return (
    <div className="p-6 space-y-6">
      <div className="bg-secondary/40 rounded-xl p-6">
        <h2 className="text-lg font-medium mb-4">Я оценил ситуацию и собрал всё самое важное</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Законодательство</span>
                  <span>•</span>
                  <span className="text-orange-500">Повышенные риски</span>
                </div>
                <h3 className="font-medium mb-1">Обработка персональных данных</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Ужесточились требования к обработке персональных данных и существенно выросли штрафы за выявленные нарушения.
                </p>
                <button className="feature-button">
                  Обновить оборудование
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Новость</span>
                  <span>•</span>
                  <span className="text-orange-500">Повышенные риски</span>
                </div>
                <h3 className="font-medium mb-1">Магазин-склад закрыт Роспотребнадзором</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Невский районный суд Петербурга закрыл магазин-склад из-за нарушений санитарных требований.
                </p>
                <button className="feature-button">
                  Защитить пользователей
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="feature-card">
            <div className="flex items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>Мера</span>
                  <span>•</span>
                  <span className="text-orange-500">Просрочено на 14 дней</span>
                </div>
                <h3 className="font-medium mb-1">Немного задержались с этой мерой</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Если не навёрстать упущенное, возможны задержки в других процессах. Давай не допустим эффекта домино.
                </p>
                <button className="feature-button">
                  Исправить ситуацию
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={tab} onValueChange={setTab} className="space-y-6">
        <TabsList className="bg-background border">
          <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Обзор</TabsTrigger>
          <TabsTrigger value="process-map" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg">Карта процессов</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <CustomizableDashboard />
        </TabsContent>
        
        <TabsContent value="process-map" className="space-y-4">
          <BusinessProcessMap />
        </TabsContent>
      </Tabs>
    </div>
  );
}
