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
    <div className={cn('flex flex-col items-center justify-center gap-3 p-8 text-[#9E8E81]', className)}>
      <Loader2 className={cn('animate-spin text-[#D49B5B]', sizes[size])} />
      {label && <p className="text-xs font-semibold text-[#DDD3CA] tracking-tight">{label}</p>}
    </div>
  );
};

