import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (option: string, checked: boolean) => {
    if (checked) {
      setSelectedOptions(prev => [...prev, option]);
    } else {
      setSelectedOptions(prev => prev.filter(item => item !== option));
    }
  };

  const handleSubmit = () => {
    // Handle feedback submission
    console.log('Feedback submitted:', selectedOptions);
    onClose();
  };

  const options = [
    {
      id: 'not-related',
      label: 'Новость не относится к компании',
      description: 'Изменения в рисках будут отменены, а новость перенесена в архив'
    },
    {
      id: 'risks-not-fit',
      label: 'Новые риски не подходят для компании', 
      description: 'Новые риски будут перенесены в архив'
    },
    {
      id: 'wrong-assessment',
      label: 'Неправильно переоценены риски',
      description: 'Изменения в оценке рисков будут отозваны'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-auto"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <DialogTitle className="text-lg font-semibold">
              Что не так с оценкой?
            </DialogTitle>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Пожалуйста, укажи что именно не так:
          </p>
        </DialogHeader>

        <div className="space-y-4 mt-6">
          {options.map((option) => (
            <div key={option.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange(option.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={option.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {option.label}
                  </label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={selectedOptions.length === 0}
            className="flex-1 bg-compGreen-500 hover:bg-compGreen-600 text-white"
          >
            Продолжить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}