
import React from 'react';
import { Card as ShadcnCard } from "@/components/ui/card"
import { CardProps } from '@/types/ui-kit';

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  bordered = true,
  ...props
}) => {
  const getPaddingClass = () => {
    switch(padding) {
      case 'sm': return 'p-2';
      case 'md': return 'p-4';
      case 'lg': return 'p-6';
      case 'none': return 'p-0';
      default: return 'p-4';
    }
  };

  return (
    <ShadcnCard
      className={`
        ${getPaddingClass()}
        ${!bordered ? 'border-0' : ''}
      `}
      {...props}
    >
      {children}
    </ShadcnCard>
  );
};
