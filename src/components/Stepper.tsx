import { ChevronUp, ChevronDown } from 'lucide-react';

interface StepperProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Stepper({ label, value, onChange, placeholder, disabled }: StepperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-text-main">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder={placeholder}
          disabled={disabled}
          className={`h-10 w-full rounded-lg border border-border bg-white pl-3 pr-8 text-sm text-text-main placeholder:text-placeholder outline-none focus:border-primary focus:ring-1 focus:ring-primary ${disabled ? 'opacity-50' : ''}`}
        />
        <div className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col">
          <ChevronUp className="h-3 w-3 text-text-muted" />
          <ChevronDown className="h-3 w-3 text-text-muted" />
        </div>
      </div>
    </div>
  );
}
