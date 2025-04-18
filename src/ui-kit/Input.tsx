
import React from 'react';
import { Input as ShadcnInput } from "@/components/ui/input"
import { InputProps } from '@/types/ui-kit';

export const Input: React.FC<InputProps> = ({
  size = 'md',
  error,
  disabled = false,
  ...props
}) => {
  const getSizeClass = () => {
    switch(size) {
      case 'sm': return 'h-8 text-sm';
      case 'md': return 'h-10 text-base';
      case 'lg': return 'h-12 text-lg';
      default: return 'h-10 text-base';
    }
  };

  return (
    <ShadcnInput
      className={`
        ${getSizeClass()}
        ${error ? 'border-red-500' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      disabled={disabled}
      {...props}
    />
  );
};
