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
      container: 'bg-[#241810] border-[#3D2B1F] text-[#DDD3CA]',
      iconBg: 'bg-[#2E1F15] text-[#D49B5B] border border-[#3D2B1F]',
      icon: <Info className="w-4 h-4 shrink-0" />,
    },
    success: {
      container: 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200',
      iconBg: 'bg-emerald-950/60 text-[#22C55E] border border-emerald-800/60',
      icon: <CheckCircle2 className="w-4 h-4 shrink-0" />,
    },
    warning: {
      container: 'bg-amber-950/30 border-amber-800/50 text-amber-200',
      iconBg: 'bg-amber-950/60 text-amber-400 border border-amber-800/60',
      icon: <AlertTriangle className="w-4 h-4 shrink-0" />,
    },
    error: {
      container: 'bg-rose-950/30 border-rose-800/50 text-rose-200',
      iconBg: 'bg-rose-950/60 text-[#EF4444] border border-rose-800/60',
      icon: <AlertCircle className="w-4 h-4 shrink-0" />,
    },
  };

  const { container, iconBg, icon } = styles[type];

  return (
    <div className={cn('flex items-start gap-3 rounded-xl border p-3.5 sm:p-4 text-xs shadow-xs leading-relaxed', container, className)}>
      <div className={cn('p-1 rounded-lg shrink-0 mt-0.5', iconBg)}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-bold text-[#FBF9F5] mb-0.5 tracking-tight">{title}</h4>}
        <div className="leading-relaxed opacity-95">{message}</div>
      </div>
    </div>
  );
};

