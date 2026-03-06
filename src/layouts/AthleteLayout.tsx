import { Outlet } from 'react-router-dom';
import AthleteBottomNav from '@/components/navigation/AthleteBottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Anchor } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AthleteLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="h-14 flex items-center justify-between px-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="flex items-center gap-2">
          <Anchor className="h-6 w-6 text-primary" />
          <span className="font-display font-bold text-primary">RowIQ</span>
        </div>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>
      </header>

      <main className="flex-1 p-4 pb-20 overflow-auto">
        <Outlet />
      </main>

      <AthleteBottomNav />
    </div>
  );
}
