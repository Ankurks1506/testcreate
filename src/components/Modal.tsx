import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="relative w-full max-w-[1000px] rounded-2xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-10 pt-10 pb-0">
          {title && <h2 className="text-lg font-bold text-text-main">{title}</h2>}
          <button onClick={onClose} className="ml-auto cursor-pointer text-text-muted hover:text-text-main">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="px-10 pb-10 pt-6">
          {children}
        </div>
      </div>
    </div>
  );
}
