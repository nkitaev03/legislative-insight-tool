
import React from 'react';
import { Checkbox as ShadcnCheckbox } from "@/components/ui/checkbox"
import { CheckboxProps } from '@/types/ui-kit';

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  disabled = false,
  onChange,
  label,
  error,
  ...props
}) => {
  return (
    <div className="flex items-center">
      <ShadcnCheckbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className={`
          ${error ? 'border-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...props}
      />
      {label && (
        <label className={`ml-2 ${disabled ? 'opacity-50' : ''}`}>
          {label}
        </label>
      )}
    </div>
  );
};
