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
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-semibold text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={`
            w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder-gray-400
            transition-all duration-200 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error 
              ? 'border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-200 hover:border-gray-300'
            }
            ${className || ''}
          `}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-red-600 font-medium flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";