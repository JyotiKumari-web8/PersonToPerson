import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string | React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  className,
}) => {
  const styles = {
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-800',
      icon: <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />,
    },
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-800',
      icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />,
    },
  };

  const { container, icon } = styles[type];

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-3.5 text-xs', container, className)}>
      {icon}
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        <div className="leading-relaxed opacity-95">{message}</div>
      </div>
    </div>
  );
};
