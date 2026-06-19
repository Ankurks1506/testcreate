import type { ReactNode } from 'react';
import IconRail from './IconRail';
import TopNav from './TopNav';

interface AppLayoutProps {
  breadcrumbs: string[];
  children: ReactNode;
  activeNav?: string;
  onNav?: (label: string) => void;
  publishButton?: boolean;
}

export default function AppLayout({
  breadcrumbs, children, activeNav, onNav, publishButton,
}: AppLayoutProps) {
  const activeIndex = activeNav === 'Dashboard' ? 0 : activeNav === 'Test creation' ? 1 : undefined;

  return (
    <div className="flex h-screen overflow-hidden bg-page-bg">
      <IconRail
        activeIndex={activeIndex}
        onNavigate={(i) => {
          if (i === 0) onNav?.('Dashboard');
          else if (i === 1) onNav?.('Test creation');
        }}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav breadcrumbs={breadcrumbs} publishButton={publishButton} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
