import {
  TrendingUp, Edit3, Info, FileText, Users, Building, User,
  Archive, GraduationCap, Eye, Bell, Settings,
} from 'lucide-react';

const icons = [
  TrendingUp, Edit3, Info, FileText, Users, Building, User,
  Archive, GraduationCap, Eye, Bell, Settings,
];

interface IconRailProps {
  activeIndex?: number;
  onNavigate?: (index: number) => void;
}

export default function IconRail({ activeIndex, onNavigate }: IconRailProps) {
  return (
    <aside className="flex w-12 shrink-0 flex-col items-center border-r border-border bg-surface py-4 gap-4">
      {icons.map((Icon, i) => (
        <button
          key={i}
          onClick={() => onNavigate?.(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg cursor-pointer transition-colors ${
            activeIndex === i
              ? 'text-primary'
              : 'text-text-muted hover:text-text-main'
          }`}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </aside>
  );
}
