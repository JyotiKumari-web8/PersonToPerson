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
        'flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-200 bg-white/50',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-3">
        {icon}
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 text-xs text-slate-500 max-w-sm leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
