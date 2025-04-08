
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TourStep {
  target: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

interface GuidedTourProps {
  steps: TourStep[];
  onComplete?: () => void;
  showOnlyOnce?: boolean;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({
  steps,
  onComplete,
  showOnlyOnce = true,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompletedTour, setHasCompletedTour] = useLocalStorage('guided-tour-completed', false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Delay to ensure DOM is loaded
    const timer = setTimeout(() => {
      setIsReady(true);
      if (showOnlyOnce && hasCompletedTour) {
        return;
      }
      setIsVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [hasCompletedTour, showOnlyOnce]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    setHasCompletedTour(true);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isReady || !isVisible || steps.length === 0) {
    return null;
  }

  const currentTargetElement = document.querySelector(steps[currentStep].target);

  if (!currentTargetElement) {
    console.warn(`Target element ${steps[currentStep].target} not found in the DOM`);
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0" onClick={handleSkip} />
      
      <Popover open={true}>
        <PopoverTrigger asChild>
          <div style={{
            position: 'absolute',
            top: currentTargetElement.getBoundingClientRect().top + window.scrollY,
            left: currentTargetElement.getBoundingClientRect().left + window.scrollX,
            width: currentTargetElement.getBoundingClientRect().width,
            height: currentTargetElement.getBoundingClientRect().height,
          }} className="border-2 border-primary rounded-md pointer-events-none" />
        </PopoverTrigger>
        
        <PopoverContent 
          side={steps[currentStep].position || 'bottom'} 
          className="w-80 pointer-events-auto"
          sideOffset={5}
        >
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{steps[currentStep].title}</h4>
              <Button variant="ghost" size="icon" onClick={handleSkip} className="h-5 w-5">
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">{steps[currentStep].content}</p>
            <div className="flex justify-between items-center pt-2">
              <div className="text-xs text-muted-foreground">
                Шаг {currentStep + 1} из {steps.length}
              </div>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    Назад
                  </Button>
                )}
                {currentStep < steps.length - 1 ? (
                  <Button size="sm" onClick={handleNext}>
                    Далее
                  </Button>
                ) : (
                  <Button size="sm" onClick={handleComplete}>
                    Завершить
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GuidedTour;
