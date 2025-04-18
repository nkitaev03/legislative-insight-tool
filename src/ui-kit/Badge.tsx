
import React from 'react';
import { Badge as ShadcnBadge } from "@/components/ui/badge"
import { BadgeProps } from '@/types/ui-kit';

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const getVariant = () => {
    switch(variant) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'success': return 'success';
      case 'error': return 'destructive';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'text-xs py-0 px-2';
      case 'md': return 'text-sm py-0.5 px-2.5';
      case 'lg': return 'text-base py-1 px-3';
      default: return 'text-sm py-0.5 px-2.5';
    }
  };

  return (
    <ShadcnBadge
      variant={getVariant()}
      className={getSizeClass()}
      {...props}
    >
      {children}
    </ShadcnBadge>
  );
};
