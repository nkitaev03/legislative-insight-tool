
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export default function MetricCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend, 
  className,
  variant = 'default'
}: MetricCardProps) {
  const variantClasses = {
    default: '',
    success: 'border-l-4 border-l-compGreen-500',
    danger: 'border-l-4 border-l-red-500',
    warning: 'border-l-4 border-l-compOrange-500'
  };

  return (
    <Card className={cn("overflow-hidden", variantClasses[variant], className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        
        {(description || trend) && (
          <div className="flex items-center mt-1">
            {trend && (
              <div 
                className={cn(
                  "text-xs font-medium mr-2",
                  trend.isPositive ? "text-compGreen-500" : "text-destructive"
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
