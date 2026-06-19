import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs font-semibold text-text-main">{label}</label>}
      <input
        id={id}
        className={`h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      />
    </div>
  );
}
