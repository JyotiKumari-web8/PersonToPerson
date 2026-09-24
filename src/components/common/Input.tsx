import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 8);

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center rounded-lg shadow-xs">
          {leftAddon && (
            <div className="absolute left-3 flex items-center pointer-events-none text-slate-400">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-slate-800 placeholder-slate-400 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500',
              leftAddon ? 'pl-9' : '',
              rightAddon ? 'pr-9' : '',
              error
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200'
                : 'border-slate-300 hover:border-slate-400',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightAddon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1 text-xs text-rose-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-slate-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
