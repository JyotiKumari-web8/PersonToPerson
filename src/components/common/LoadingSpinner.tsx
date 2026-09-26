import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className,
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3 p-8 text-[#94A3B8]', className)}>
      <Loader2 className={cn('animate-spin text-[#0EA5E9]', sizes[size])} />
      {label && <p className="text-xs font-semibold text-[#CBD5E1] tracking-tight">{label}</p>}
    </div>
  );
};

