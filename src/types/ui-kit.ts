
import { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onClick?: () => void;
}

export interface InputProps {
  size?: 'sm' | 'md' | 'lg';
  error?: string;
  disabled?: boolean;
}

export interface TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  children: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg' | 'none';
  bordered?: boolean;
}

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  error?: string;
}

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

export interface AlertProps {
  children: ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  icon?: ReactNode;
}
