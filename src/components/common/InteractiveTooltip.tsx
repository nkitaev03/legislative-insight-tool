
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface InteractiveTooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
  icon?: boolean;
  className?: string;
}

export const InteractiveTooltip: React.FC<InteractiveTooltipProps> = ({
  content,
  children,
  icon = true,
  className = '',
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center ${className}`}>
            {children}
            {icon && !children && (
              <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            )}
            {icon && children && (
              <HelpCircle className="ml-1 h-4 w-4 text-muted-foreground cursor-help" />
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-4">
          <div className="text-sm">{content}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InteractiveTooltip;
