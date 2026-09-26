import React from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-dashed border-[#20344D] bg-[#101D30] text-[#F8FAFC] shadow-2xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-[#14243A] border border-[#20344D] text-[#38BDF8] flex items-center justify-center mb-3.5 shadow-2xs">
        {icon}
      </div>
      <h4 className="text-sm font-bold text-[#F8FAFC] tracking-tight">{title}</h4>
      <p className="mt-1.5 text-xs text-[#94A3B8] max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
};

