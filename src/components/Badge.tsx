import type { ReactNode } from 'react';

interface BadgeProps {
  variant?: 'amber' | 'green' | 'navy' | 'default' | 'success';
  icon?: ReactNode;
  children: ReactNode;
}

const styles: Record<string, string> = {
  amber: 'bg-amber-bg text-amber-text',
  green: 'bg-success-bg text-success-text',
  success: 'bg-success-bg text-success',
  navy: 'bg-navy text-white',
  default: 'bg-gray-100 text-text-muted',
};

export default function Badge({ variant = 'default', icon, children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-tight ${styles[variant]}`}>
      {icon && <span className="w-3 h-3">{icon}</span>}
      {children}
    </span>
  );
}
