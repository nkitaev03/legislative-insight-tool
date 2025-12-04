import React, { useState } from 'react';
import { Shield, Plus, Link2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

export interface Measure {
  id: string;
  name: string;
  description: string;
  type: 'preventive' | 'detective' | 'corrective';
  status: 'planned' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  riskId: string;
  riskName: string;
  responsible: string;
  dueDate: string;
  progress: number;
  createdAt: string;
}

const mockMeasures: Measure[] = [
  {
    id: 'measure-1',
    name: 'Обновление системы отчётности',
    description: 'Внедрение новых форм отчётности в соответствии с требованиями ЦБ.',
    type: 'corrective',
    status: 'in_progress',
    priority: 'high',
    riskId: 'risk-1',
    riskName: 'Несоответствие регуляторным требованиям',
    responsible: 'Иванов А.С.',
    dueDate: '2024-12-31',
    progress: 60,
    createdAt: '2024-12-02'
  },
  {
    id: 'measure-2',
    name: 'Обучение персонала',
    description: 'Проведение тренингов по новым регуляторным требованиям для сотрудников.',
    type: 'preventive',
    status: 'planned',
    priority: 'medium',
    riskId: 'risk-1',
    riskName: 'Несоответствие регуляторным требованиям',
    responsible: 'Петрова М.В.',
    dueDate: '2025-01-15',
    progress: 0,
    createdAt: '2024-12-03'
  },
  {
    id: 'measure-3',
    name: 'Резервирование IT-инфраструктуры',
    description: 'Внедрение дублирующих серверов для платёжной системы.',
    type: 'preventive',
    status: 'completed',
    priority: 'high',
    riskId: 'risk-3',
    riskName: 'Операционный риск IT-систем',
    responsible: 'Сидоров К.П.',
    dueDate: '2024-11-30',
    progress: 100,
    createdAt: '2024-11-28'
  },
  {
    id: 'measure-4',
    name: 'Аудит кибербезопасности',
    description: 'Проведение внешнего аудита систем защиты информации.',
    type: 'detective',
    status: 'overdue',
    priority: 'high',
    riskId: 'risk-4',
    riskName: 'Кибербезопасность',
    responsible: 'Козлов Д.И.',
    dueDate: '2024-11-20',
    progress: 30,
    createdAt: '2024-11-01'
  }
];

const typeLabels = {
  preventive: 'Превентивная',
  detective: 'Детективная',
  corrective: 'Корректирующая'
};

const typeColors = {
  preventive: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  detective: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
  corrective: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
};

const statusIcons = {
  planned: Clock,
  in_progress: AlertCircle,
  completed: CheckCircle2,
  overdue: AlertCircle
};

const statusColors = {
  planned: 'text-muted-foreground',
  in_progress: 'text-blue-500',
  completed: 'text-green-500',
  overdue: 'text-red-500'
};

const priorityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

export default function MeasuresPage() {
  const [measures, setMeasures] = useState<Measure[]>(mockMeasures);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newMeasure, setNewMeasure] = useState({
    name: '',
    description: '',
    type: 'preventive' as Measure['type'],
    priority: 'medium' as Measure['priority'],
    riskName: '',
    responsible: '',
    dueDate: ''
  });

  const handleAddMeasure = () => {
    const measure: Measure = {
      id: `measure-${Date.now()}`,
      name: newMeasure.name,
      description: newMeasure.description,
      type: newMeasure.type,
      status: 'planned',
      priority: newMeasure.priority,
      riskId: `risk-${Date.now()}`,
      riskName: newMeasure.riskName,
      responsible: newMeasure.responsible,
      dueDate: newMeasure.dueDate,
      progress: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setMeasures([measure, ...measures]);
    setNewMeasure({
      name: '',
      description: '',
      type: 'preventive',
      priority: 'medium',
      riskName: '',
      responsible: '',
      dueDate: ''
    });
    setIsDialogOpen(false);
  };

  const getStatusLabel = (status: Measure['status']) => {
    const labels = {
      planned: 'Запланировано',
      in_progress: 'В процессе',
      completed: 'Выполнено',
      overdue: 'Просрочено'
    };
    return labels[status];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Меры</h1>
          <p className="text-muted-foreground">Действия по митигации рисков</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Новая мера
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Создание новой меры</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Название меры</Label>
                <Input
                  id="name"
                  value={newMeasure.name}
                  onChange={(e) => setNewMeasure({ ...newMeasure, name: e.target.value })}
                  placeholder="Введите название"
                />
              </div>
              <div>
                <Label htmlFor="riskName">Связанный риск</Label>
                <Input
                  id="riskName"
                  value={newMeasure.riskName}
                  onChange={(e) => setNewMeasure({ ...newMeasure, riskName: e.target.value })}
                  placeholder="Название риска"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Тип меры</Label>
                  <Select
                    value={newMeasure.type}
                    onValueChange={(value: Measure['type']) => setNewMeasure({ ...newMeasure, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="preventive">Превентивная</SelectItem>
                      <SelectItem value="detective">Детективная</SelectItem>
                      <SelectItem value="corrective">Корректирующая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Приоритет</Label>
                  <Select
                    value={newMeasure.priority}
                    onValueChange={(value: Measure['priority']) => setNewMeasure({ ...newMeasure, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Низкий</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="high">Высокий</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsible">Ответственный</Label>
                  <Input
                    id="responsible"
                    value={newMeasure.responsible}
                    onChange={(e) => setNewMeasure({ ...newMeasure, responsible: e.target.value })}
                    placeholder="ФИО"
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Срок</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={newMeasure.dueDate}
                    onChange={(e) => setNewMeasure({ ...newMeasure, dueDate: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={newMeasure.description}
                  onChange={(e) => setNewMeasure({ ...newMeasure, description: e.target.value })}
                  placeholder="Опишите меру подробно"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddMeasure} className="w-full">
                Создать меру
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {measures.map((measure) => {
          const StatusIcon = statusIcons[measure.status];
          return (
            <Card key={measure.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{measure.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Link2 className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{measure.riskName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={typeColors[measure.type]}>{typeLabels[measure.type]}</Badge>
                    <Badge className={priorityColors[measure.priority]}>
                      {measure.priority === 'low' && 'Низкий'}
                      {measure.priority === 'medium' && 'Средний'}
                      {measure.priority === 'high' && 'Высокий'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{measure.description}</p>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <StatusIcon className={`h-4 w-4 ${statusColors[measure.status]}`} />
                      <span>{getStatusLabel(measure.status)}</span>
                    </div>
                    <span className="text-muted-foreground">Ответственный: {measure.responsible}</span>
                    <span className="text-muted-foreground">Срок: {measure.dueDate}</span>
                  </div>
                  <span className="text-sm font-medium">{measure.progress}%</span>
                </div>
                <Progress value={measure.progress} className="h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
