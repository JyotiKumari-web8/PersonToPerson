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
          <label htmlFor={inputId} className="block text-[11px] font-bold text-[#CBD5E1] uppercase tracking-wider mb-1.5">
            {label}
            {props.required && <span className="text-[#EF4444] ml-1 font-bold">*</span>}
          </label>
        )}
        <div className="relative flex items-center rounded-xl shadow-2xs">
          {leftAddon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-[#94A3B8]">
              {leftAddon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-xl border bg-[#14243A] px-3.5 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#94A3B8]/60 transition-all duration-150',
              'focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/25 focus:border-[#0EA5E9]',
              leftAddon ? 'pl-10' : '',
              rightAddon ? 'pr-10' : '',
              error
                ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20 text-[#EF4444]'
                : 'border-[#20344D] hover:border-[#38BDF8]/40',
              className
            )}
            {...props}
          />
          {rightAddon && (
            <div className="absolute right-3.5 flex items-center text-[#94A3B8]">
              {rightAddon}
            </div>
          )}
        </div>
        {error ? (
          <p className="mt-1.5 text-xs text-[#EF4444] font-medium flex items-center gap-1">
            <span>•</span> {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-[#94A3B8] leading-normal">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

