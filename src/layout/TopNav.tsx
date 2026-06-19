import { RefreshCw, Bell, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopNavProps {
  breadcrumbs: string[];
  publishButton?: boolean;
}

export default function TopNav({ breadcrumbs, publishButton }: TopNavProps) {
  const { user } = useAuth();
  const displayName = user?.name || user?.email || 'Alex Wando';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-5 shrink-0">
      <div className="flex items-center gap-3">
        <svg width="90" height="22" viewBox="0 0 110 28" fill="none">
          <text x="0" y="18" fontSize="18" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#0F172A">Prep</text>
          <text x="42" y="18" fontSize="18" fontWeight="700" fontFamily="system-ui, sans-serif" fill="#5B6FE8">Route</text>
          <path d="M2 -1 Q5 -4 8 -1 Q11 2 14 -1" stroke="#0F172A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
        <nav className="flex items-center gap-1.5 text-xs text-text-muted ml-4">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-1.5">
              {i > 0 && <span className="text-border">/</span>}
              <span className={i === breadcrumbs.length - 1 ? 'font-medium text-text-main' : ''}>
                {crumb}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {publishButton && (
          <button className="h-9 rounded-lg bg-primary px-4 text-sm font-semibold text-white cursor-pointer hover:bg-primary-hover transition-colors">
            Publish
          </button>
        )}
        <button className="cursor-pointer rounded-lg p-2 text-text-muted hover:bg-gray-50 transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
        <button className="relative cursor-pointer rounded-lg p-2 text-text-muted hover:bg-gray-50 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-success" />
        </button>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-main leading-tight">{displayName}</span>
            <span className="text-[10px] text-text-muted leading-tight">Admin</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-text-muted" />
        </div>
      </div>
    </header>
  );
}
