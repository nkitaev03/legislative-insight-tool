
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Calendar as CalendarIcon, CheckCircle, ListTodo } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface QuickTaskAssignmentProps {
  buttonVariant?: "default" | "outline" | "ghost" | "secondary";
  buttonSize?: "default" | "sm" | "lg" | "icon";
  buttonText?: string;
  onTaskAssigned?: (task: any) => void;
}

const QuickTaskAssignment: React.FC<QuickTaskAssignmentProps> = ({ 
  buttonVariant = "default",
  buttonSize = "default",
  buttonText = "Назначить задачу",
  onTaskAssigned 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsible, setResponsible] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create task object
    const task = {
      id: Date.now().toString(),
      title,
      description,
      responsible,
      priority,
      deadline,
      status: 'pending',
      createdAt: new Date()
    };

    // Call the callback if provided
    if (onTaskAssigned) {
      onTaskAssigned(task);
    }

    // Show toast
    toast({
      title: "Задача назначена",
      description: `Задача "${title}" назначена на ${responsible}`,
      className: "bg-compGreen-50 border-l-4 border-compGreen-500",
    });

    // Reset form and close dialog
    resetForm();
    setIsOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setResponsible('');
    setPriority('medium');
    setDeadline(undefined);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={buttonVariant} size={buttonSize}>
          <ListTodo className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Назначить новую задачу</DialogTitle>
          <DialogDescription>
            Создайте задачу и назначьте ответственного для выполнения
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Название задачи
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название задачи"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Описание
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Опишите задачу подробнее..."
              className="min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="responsible" className="text-sm font-medium">
                Ответственный
              </label>
              <Select 
                value={responsible} 
                onValueChange={setResponsible}
                required
              >
                <SelectTrigger id="responsible">
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Иванов И.И.">Иванов И.И.</SelectItem>
                  <SelectItem value="Петрова А.С.">Петрова А.С.</SelectItem>
                  <SelectItem value="Смирнова Е.В.">Смирнова Е.В.</SelectItem>
                  <SelectItem value="Козлов А.А.">Козлов А.А.</SelectItem>
                  <SelectItem value="Никитин В.П.">Никитин В.П.</SelectItem>
                  <SelectItem value="Сидоров М.Н.">Сидоров М.Н.</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="priority" className="text-sm font-medium">
                Приоритет
              </label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Выберите приоритет" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">Высокий</SelectItem>
                  <SelectItem value="medium">Средний</SelectItem>
                  <SelectItem value="low">Низкий</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium">
              Срок выполнения
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !deadline && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? (
                    format(deadline, 'PPP', { locale: ru })
                  ) : (
                    "Выберите дату"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={deadline}
                  onSelect={setDeadline}
                  initialFocus
                  locale={ru}
                />
              </PopoverContent>
            </Popover>
          </div>

          <DialogFooter className="pt-4">
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              Отмена
            </Button>
            <Button type="submit">
              <CheckCircle className="mr-2 h-4 w-4" />
              Создать задачу
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickTaskAssignment;
