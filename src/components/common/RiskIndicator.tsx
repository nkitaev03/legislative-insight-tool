
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RiskIndicatorProps {
  level: 'low' | 'medium' | 'high';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function RiskIndicator({ 
  level, 
  size = 'md', 
  showLabel = false,
  className 
}: RiskIndicatorProps) {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const levelClasses = {
    low: 'bg-compGreen-500 shadow-[0_0_5px_rgba(37,184,115,0.5)]',
    medium: 'bg-compOrange-500 shadow-[0_0_5px_rgba(255,122,15,0.5)]',
    high: 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]'
  };

  const levelLabels = {
    low: 'Низкий',
    medium: 'Средний',
    high: 'Высокий'
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={cn('flex items-center gap-2', className)}>
            <div className={cn(
              'rounded-full animate-pulse-light', 
              sizeClasses[size], 
              levelClasses[level]
            )} />
            {showLabel && (
              <span className={cn(
                "text-sm font-medium",
                level === 'low' && 'text-compGreen-600',
                level === 'medium' && 'text-compOrange-600',
                level === 'high' && 'text-red-600'
              )}>
                {levelLabels[level]}
              </span>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Уровень риска: {levelLabels[level]}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
