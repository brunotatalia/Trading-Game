import React, { forwardRef } from 'react';
import clsx from 'clsx';

type InputType = 'text' | 'number' | 'currency';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  helperText?: string;
  type?: InputType;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      type = 'text',
      leftIcon,
      rightIcon,
      className,
      ...props
    },
    ref
  ) => {
    const inputType = type === 'currency' ? 'number' : type;
    const step = type === 'currency' ? '0.01' : props.step;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          {type === 'currency' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
              $
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            step={step}
            className={clsx(
              'w-full px-4 py-2.5 rounded-lg border transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
              'disabled:bg-gray-100 disabled:cursor-not-allowed',
              error
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-300',
              leftIcon && 'pr-10',
              type === 'currency' && 'pr-8',
              rightIcon && 'pl-10',
              className
            )}
            {...props}
          />

          {rightIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
