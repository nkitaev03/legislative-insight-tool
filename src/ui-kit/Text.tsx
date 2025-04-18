
import React from 'react';
import { TextProps } from '@/types/ui-kit';

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  children,
  ...props
}) => {
  const getVariantClass = () => {
    switch(variant) {
      case 'h1': return 'text-4xl font-bold';
      case 'h2': return 'text-3xl font-bold';
      case 'h3': return 'text-2xl font-bold';
      case 'h4': return 'text-xl font-bold';
      case 'h5': return 'text-lg font-bold';
      case 'h6': return 'text-base font-bold';
      case 'body1': return 'text-base';
      case 'body2': return 'text-sm';
      case 'caption': return 'text-xs';
      default: return 'text-base';
    }
  };

  const getColorClass = () => {
    switch(color) {
      case 'primary': return 'text-foreground';
      case 'secondary': return 'text-muted-foreground';
      case 'error': return 'text-destructive';
      case 'success': return 'text-compGreen-500';
      case 'warning': return 'text-compOrange-500';
      default: return 'text-foreground';
    }
  };

  return (
    <p
      className={`
        ${getVariantClass()}
        ${getColorClass()}
        text-${align}
      `}
      {...props}
    >
      {children}
    </p>
  );
};
