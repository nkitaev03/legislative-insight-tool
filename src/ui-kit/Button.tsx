
import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button"
import { ButtonProps } from '@/types/ui-kit';

export const Button: React.FC<ButtonProps> = ({ 
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  onClick,
  ...props 
}) => {
  const getVariant = () => {
    switch(variant) {
      case 'primary': return 'default';
      case 'secondary': return 'secondary';
      case 'tertiary': return 'outline';
      case 'danger': return 'destructive';
      default: return 'default';
    }
  };

  const getSize = () => {
    switch(size) {
      case 'sm': return 'sm';
      case 'md': return 'default';
      case 'lg': return 'lg';
      default: return 'default';
    }
  };

  return (
    <ShadcnButton
      variant={getVariant()}
      size={getSize()}
      disabled={disabled || loading}
      className={`${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
      onClick={onClick}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {loading ? 'Loading...' : children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </ShadcnButton>
  );
};
