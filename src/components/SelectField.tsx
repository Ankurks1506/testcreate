import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  placeholder?: string;
}

export default function SelectField({ label, id, placeholder, children, className = '', ...props }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={id} className="text-xs font-semibold text-text-main">{label}</label>}
      <div className="relative">
        <select
          id={id}
          className={`h-10 w-full appearance-none rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-text-main outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="text-placeholder">{placeholder}</option>}
          {children}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
      </div>
    </div>
  );
}
