import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const base = 'inline-flex items-center justify-center font-semibold rounded-lg cursor-pointer transition-colors';

const variants: Record<string, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-secondary-bg text-primary hover:bg-primary/10',
  danger: 'bg-destructive text-white hover:bg-red-500',
  ghost: 'bg-transparent text-text-muted hover:text-text-main',
};

const sizes: Record<string, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-sm',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, disabled, ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
