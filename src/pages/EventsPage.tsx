import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'new' | 'in_progress' | 'resolved';
  risks: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Изменение регуляторных требований',
    description: 'Центральный банк опубликовал новые требования к отчётности по операционным рискам. Необходимо адаптировать внутренние процессы.',
    date: '2024-12-01',
    category: 'Регуляторные изменения',
    severity: 'high',
    status: 'in_progress',
    risks: ['risk-1', 'risk-2']
  },
  {
    id: '2',
    title: 'Сбой в системе платежей',
    description: 'Зафиксирован кратковременный сбой в работе платёжной системы. Время простоя составило 15 минут.',
    date: '2024-11-28',
    category: 'Технические инциденты',
    severity: 'medium',
    status: 'resolved',
    risks: ['risk-3']
  },
  {
    id: '3',
    title: 'Аудиторская проверка',
    description: 'Запланирована внешняя аудиторская проверка систем внутреннего контроля.',
    date: '2024-12-15',
    category: 'Аудит',
    severity: 'low',
    status: 'new',
    risks: []
  }
];

const severityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const statusLabels = {
  new: 'Новое',
  in_progress: 'В работе',
  resolved: 'Решено'
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: '',
    severity: 'medium' as Event['severity']
  });

  const handleAddEvent = () => {
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: new Date().toISOString().split('T')[0],
      category: newEvent.category,
      severity: newEvent.severity,
      status: 'new',
      risks: []
    };
    setEvents([event, ...events]);
    setNewEvent({ title: '', description: '', category: '', severity: 'medium' });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">События</h1>
          <p className="text-muted-foreground">Регистрация и отслеживание событий для идентификации рисков</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Новое событие
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Регистрация нового события</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="title">Название</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Введите название события"
                />
              </div>
              <div>
                <Label htmlFor="category">Категория</Label>
                <Input
                  id="category"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                  placeholder="Например: Технические инциденты"
                />
              </div>
              <div>
                <Label htmlFor="severity">Критичность</Label>
                <Select
                  value={newEvent.severity}
                  onValueChange={(value: Event['severity']) => setNewEvent({ ...newEvent, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Низкая</SelectItem>
                    <SelectItem value="medium">Средняя</SelectItem>
                    <SelectItem value="high">Высокая</SelectItem>
                    <SelectItem value="critical">Критическая</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Опишите событие подробно"
                  rows={4}
                />
              </div>
              <Button onClick={handleAddEvent} className="w-full">
                Зарегистрировать событие
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <Card key={event.id} className="overflow-hidden">
            <CardHeader 
              className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => setExpandedId(expandedId === event.id ? null : event.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{event.date} • {event.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={severityColors[event.severity]}>
                    {event.severity === 'low' && 'Низкая'}
                    {event.severity === 'medium' && 'Средняя'}
                    {event.severity === 'high' && 'Высокая'}
                    {event.severity === 'critical' && 'Критическая'}
                  </Badge>
                  <Badge variant="outline">{statusLabels[event.status]}</Badge>
                  {expandedId === event.id ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            {expandedId === event.id && (
              <CardContent className="border-t bg-muted/20">
                <div className="pt-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Описание</h4>
                    <p className="text-muted-foreground">{event.description}</p>
                  </div>
                  {event.risks.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        Связанные риски
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {event.risks.map((riskId) => (
                          <Badge key={riskId} variant="secondary">
                            {riskId}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Редактировать
                    </Button>
                    <Button variant="outline" size="sm">
                      Создать риск
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
