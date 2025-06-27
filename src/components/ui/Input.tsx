import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="input-group">
        {label && (
          <label 
            htmlFor={inputId}
            className="input-label"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={`input ${error ? 'error' : ''} ${className || ''}`}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="input-error">{error}</p>
        )}
        {helperText && !error && (
          <p className="input-helper">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";