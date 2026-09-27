import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#2E1F15] text-[#D49B5B] border-[#3D2B1F]',
    success: 'bg-emerald-950/40 text-[#22C55E] border-emerald-800/50',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-800/50',
    danger: 'bg-rose-950/40 text-[#EF4444] border-rose-800/50',
    neutral: 'bg-[#2E1F15] text-[#DDD3CA] border-[#3D2B1F]',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border tracking-tight',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

