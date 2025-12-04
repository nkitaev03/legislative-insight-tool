import React, { useState } from 'react';
import { AlertTriangle, Plus, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface Risk {
  id: string;
  name: string;
  description: string;
  category: string;
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'assessed' | 'mitigated' | 'closed';
  source: {
    type: 'event' | 'audit' | 'external' | 'internal';
    id?: string;
    name: string;
  };
  createdAt: string;
  measures: string[];
}

const mockRisks: Risk[] = [
  {
    id: 'risk-1',
    name: 'Несоответствие регуляторным требованиям',
    description: 'Риск штрафов и санкций из-за несоблюдения новых требований ЦБ к отчётности.',
    category: 'Комплаенс',
    probability: 'medium',
    impact: 'high',
    status: 'assessed',
    source: {
      type: 'event',
      id: '1',
      name: 'Изменение регуляторных требований'
    },
    createdAt: '2024-12-01',
    measures: ['measure-1', 'measure-2']
  },
  {
    id: 'risk-2',
    name: 'Репутационный риск',
    description: 'Потенциальное негативное влияние на репутацию компании при публичном раскрытии нарушений.',
    category: 'Репутационные',
    probability: 'low',
    impact: 'high',
    status: 'identified',
    source: {
      type: 'event',
      id: '1',
      name: 'Изменение регуляторных требований'
    },
    createdAt: '2024-12-02',
    measures: []
  },
  {
    id: 'risk-3',
    name: 'Операционный риск IT-систем',
    description: 'Риск повторных сбоев в платёжной системе и связанных финансовых потерь.',
    category: 'Операционные',
    probability: 'medium',
    impact: 'medium',
    status: 'mitigated',
    source: {
      type: 'event',
      id: '2',
      name: 'Сбой в системе платежей'
    },
    createdAt: '2024-11-28',
    measures: ['measure-3']
  },
  {
    id: 'risk-4',
    name: 'Кибербезопасность',
    description: 'Риск кибератак и утечки данных клиентов.',
    category: 'IT-риски',
    probability: 'medium',
    impact: 'critical',
    status: 'assessed',
    source: {
      type: 'external',
      name: 'Анализ угроз рынка'
    },
    createdAt: '2024-11-15',
    measures: ['measure-4']
  }
];

const probabilityColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const impactColors = {
  low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
};

const sourceTypeLabels = {
  event: 'Событие',
  audit: 'Аудит',
  external: 'Внешний источник',
  internal: 'Внутренний анализ'
};

const statusLabels = {
  identified: 'Идентифицирован',
  assessed: 'Оценён',
  mitigated: 'Митигирован',
  closed: 'Закрыт'
};

export default function RisksPage() {
  const [risks, setRisks] = useState<Risk[]>(mockRisks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRisk, setNewRisk] = useState({
    name: '',
    description: '',
    category: '',
    probability: 'medium' as Risk['probability'],
    impact: 'medium' as Risk['impact'],
    sourceType: 'internal' as Risk['source']['type'],
    sourceName: ''
  });

  const handleAddRisk = () => {
    const risk: Risk = {
      id: `risk-${Date.now()}`,
      name: newRisk.name,
      description: newRisk.description,
      category: newRisk.category,
      probability: newRisk.probability,
      impact: newRisk.impact,
      status: 'identified',
      source: {
        type: newRisk.sourceType,
        name: newRisk.sourceName
      },
      createdAt: new Date().toISOString().split('T')[0],
      measures: []
    };
    setRisks([risk, ...risks]);
    setNewRisk({
      name: '',
      description: '',
      category: '',
      probability: 'medium',
      impact: 'medium',
      sourceType: 'internal',
      sourceName: ''
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Риски</h1>
          <p className="text-muted-foreground">Реестр всех идентифицированных рисков</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Фильтры
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Новый риск
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Регистрация нового риска</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="name">Название риска</Label>
                  <Input
                    id="name"
                    value={newRisk.name}
                    onChange={(e) => setNewRisk({ ...newRisk, name: e.target.value })}
                    placeholder="Введите название"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Категория</Label>
                  <Input
                    id="category"
                    value={newRisk.category}
                    onChange={(e) => setNewRisk({ ...newRisk, category: e.target.value })}
                    placeholder="Например: Операционные"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Вероятность</Label>
                    <Select
                      value={newRisk.probability}
                      onValueChange={(value: Risk['probability']) => setNewRisk({ ...newRisk, probability: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="high">Высокая</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Влияние</Label>
                    <Select
                      value={newRisk.impact}
                      onValueChange={(value: Risk['impact']) => setNewRisk({ ...newRisk, impact: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Низкое</SelectItem>
                        <SelectItem value="medium">Среднее</SelectItem>
                        <SelectItem value="high">Высокое</SelectItem>
                        <SelectItem value="critical">Критическое</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Тип источника</Label>
                  <Select
                    value={newRisk.sourceType}
                    onValueChange={(value: Risk['source']['type']) => setNewRisk({ ...newRisk, sourceType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Событие</SelectItem>
                      <SelectItem value="audit">Аудит</SelectItem>
                      <SelectItem value="external">Внешний источник</SelectItem>
                      <SelectItem value="internal">Внутренний анализ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sourceName">Название источника</Label>
                  <Input
                    id="sourceName"
                    value={newRisk.sourceName}
                    onChange={(e) => setNewRisk({ ...newRisk, sourceName: e.target.value })}
                    placeholder="Укажите источник"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={newRisk.description}
                    onChange={(e) => setNewRisk({ ...newRisk, description: e.target.value })}
                    placeholder="Опишите риск подробно"
                    rows={3}
                  />
                </div>
                <Button onClick={handleAddRisk} className="w-full">
                  Зарегистрировать риск
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Риск</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Вероятность</TableHead>
              <TableHead>Влияние</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Меры</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {risks.map((risk) => (
              <TableRow key={risk.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <div>
                      <p className="font-medium">{risk.name}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">{risk.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{risk.category}</TableCell>
                <TableCell>
                  <Badge className={probabilityColors[risk.probability]}>
                    {risk.probability === 'low' && 'Низкая'}
                    {risk.probability === 'medium' && 'Средняя'}
                    {risk.probability === 'high' && 'Высокая'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={impactColors[risk.impact]}>
                    {risk.impact === 'low' && 'Низкое'}
                    {risk.impact === 'medium' && 'Среднее'}
                    {risk.impact === 'high' && 'Высокое'}
                    {risk.impact === 'critical' && 'Критическое'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {sourceTypeLabels[risk.source.type]}
                    </Badge>
                    {risk.source.id && (
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{risk.source.name}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{statusLabels[risk.status]}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{risk.measures.length}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
