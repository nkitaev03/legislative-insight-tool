
import { useState } from 'react';
import { Search, Filter, Calendar, FileText, AlertCircle, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import RiskIndicator from '../common/RiskIndicator';
import { Separator } from '@/components/ui/separator';

const legislationChanges = [
  {
    id: '1',
    title: 'Об изменениях в Федеральном законе "О защите персональных данных"',
    date: '12.05.2023',
    description: 'Ужесточение требований к операторам персональных данных. Введение дополнительных обязанностей.',
    category: 'Персональные данные',
    source: 'Государственная Дума РФ',
    risk: 'high',
    isNew: true,
  },
  {
    id: '2',
    title: 'Постановление Правительства РФ об учете рабочего времени',
    date: '05.05.2023',
    description: 'Обновленный порядок ведения учета рабочего времени сотрудников. Новые формы отчетности.',
    category: 'Трудовое право',
    source: 'Правительство РФ',
    risk: 'medium',
    isNew: true,
  },
  {
    id: '3',
    title: 'Изменения в налоговом законодательстве',
    date: '28.04.2023',
    description: 'Поправки в исчислении НДС для IT-компаний. Установление новых льгот и преференций.',
    category: 'Налоговое право',
    source: 'Министерство финансов',
    risk: 'medium',
    isNew: false,
  },
  {
    id: '4',
    title: 'О внесении изменений в закон "О техническом регулировании"',
    date: '15.04.2023',
    description: 'Изменение требований к сертификации продукции. Упрощение процедур для малого бизнеса.',
    category: 'Техническое регулирование',
    source: 'Министерство промышленности',
    risk: 'low',
    isNew: false,
  },
  {
    id: '5',
    title: 'Новые правила маркировки товаров',
    date: '10.04.2023',
    description: 'Расширение перечня товаров, подлежащих обязательной маркировке. Новые сроки внедрения.',
    category: 'Торговля',
    source: 'Министерство промышленности и торговли',
    risk: 'high',
    isNew: false,
  },
];

export default function MonitoringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  
  const filteredItems = legislationChanges.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesRisk = selectedRisk === 'all' || item.risk === selectedRisk;
    
    return matchesSearch && matchesCategory && matchesRisk;
  });

  const categories = ['Персональные данные', 'Трудовое право', 'Налоговое право', 'Техническое регулирование', 'Торговля'];
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Мониторинг законодательства</h1>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Экспорт
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Поиск по названию или содержанию..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Категория" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все категории</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Select value={selectedRisk} onValueChange={setSelectedRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Уровень риска" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все уровни</SelectItem>
                    <SelectItem value="high">Высокий</SelectItem>
                    <SelectItem value="medium">Средний</SelectItem>
                    <SelectItem value="low">Низкий</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Calendar className="mr-2 h-4 w-4" />
                  Период
                </Button>
                <Button variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="secondary">
                  Применить
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-grid">
          <TabsTrigger value="all">Все изменения</TabsTrigger>
          <TabsTrigger value="new" className="relative">
            Новые
            <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
              2
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tracked">Отслеживаемые</TabsTrigger>
        </TabsList>
        
        <div className="mt-6 space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge variant="secondary">{item.category}</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div className="p-3 flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <FileText className="mr-2 h-4 w-4" />
                      Подробнее
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Оценить риск
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">
                Документы по заданным критериям не найдены. Попробуйте изменить параметры поиска.
              </p>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
}
