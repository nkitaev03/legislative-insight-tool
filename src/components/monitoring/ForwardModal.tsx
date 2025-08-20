import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Send } from 'lucide-react';

interface ForwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemTitle?: string;
}

const employees = [
  { id: '1', name: 'Иванов И.И.', position: 'Руководитель отдела ИБ' },
  { id: '2', name: 'Петров П.П.', position: 'Специалист по защите данных' },
  { id: '3', name: 'Сидоров С.С.', position: 'Системный администратор' },
  { id: '4', name: 'Козлова А.В.', position: 'Юрист' },
  { id: '5', name: 'Морозов Д.М.', position: 'IT-директор' }
];

export default function ForwardModal({ isOpen, onClose, itemTitle }: ForwardModalProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [comment, setComment] = useState<string>('');

  const handleSubmit = () => {
    if (!selectedEmployee || !comment.trim()) {
      return;
    }
    
    // Здесь будет логика отправки
    console.log('Forwarding to:', selectedEmployee, 'Comment:', comment);
    
    // Сбросить форму и закрыть модальное окно
    setSelectedEmployee('');
    setComment('');
    onClose();
  };

  const handleClose = () => {
    setSelectedEmployee('');
    setComment('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 bg-compBlue-50 dark:bg-compBlue-900/20 rounded-lg">
              <Send className="w-4 h-4 text-compBlue-600" />
            </div>
            Переслать коллеге
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {itemTitle && (
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Документ:</p>
              <p className="text-sm font-medium">{itemTitle}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Выбрать сотрудника</label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger>
                <SelectValue placeholder="Выберите сотрудника" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <div>
                        <div className="text-sm font-medium">{employee.name}</div>
                        <div className="text-xs text-muted-foreground">{employee.position}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Написать комментарий</label>
            <Textarea
              placeholder="Добавьте комментарий к документу..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button 
              onClick={handleSubmit}
              disabled={!selectedEmployee || !comment.trim()}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Отправить
            </Button>
            <Button variant="outline" onClick={handleClose}>
              Отмена
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}