
import React from 'react';
import { Alert as ShadcnAlert } from "@/components/ui/alert"
import { AlertProps } from '@/types/ui-kit';

export const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  title,
  icon,
  ...props
}) => {
  const getVariant = () => {
    switch(variant) {
      case 'success': return 'success';
      case 'error': return 'destructive';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <ShadcnAlert variant={getVariant()} {...props}>
      {icon && <span className="mr-2">{icon}</span>}
      {title && <h5 className="mb-1 font-medium">{title}</h5>}
      {children}
    </ShadcnAlert>
  );
};
