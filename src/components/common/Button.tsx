import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  icon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer tracking-tight';

  const variants = {
    primary:
      'bg-[#D49B5B] hover:bg-[#E2B176] text-[#140D08] font-bold shadow-[0_2px_14px_-2px_rgba(212,155,91,0.35)] border border-[#D49B5B] focus-visible:ring-2 focus-visible:ring-[#D49B5B]/40 active:scale-[0.985]',
    secondary:
      'bg-[#2E1F15] hover:bg-[#3B281B] text-[#FBF9F5] border border-[#3D2B1F] hover:border-[#D49B5B]/40 focus-visible:ring-2 focus-visible:ring-[#D49B5B]/30 active:scale-[0.985]',
    outline:
      'bg-[#241810] hover:bg-[#2E1F15] text-[#FBF9F5] border border-[#3D2B1F] hover:border-[#D49B5B]/60 shadow-2xs hover:shadow-xs focus-visible:ring-2 focus-visible:ring-[#D49B5B]/30 active:scale-[0.985]',
    ghost:
      'hover:bg-[#2E1F15] text-[#DDD3CA] hover:text-[#FBF9F5] focus-visible:ring-2 focus-visible:ring-[#D49B5B]/30 active:scale-[0.985]',
    danger:
      'bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-xs hover:shadow-sm border border-[#EF4444] focus-visible:ring-2 focus-visible:ring-[#EF4444]/30 active:scale-[0.985]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 gap-2 rounded-xl',
    lg: 'text-base px-5 py-2.5 gap-2.5 rounded-xl font-semibold',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
      ) : icon ? (
        <span className="shrink-0 inline-flex items-center">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};

