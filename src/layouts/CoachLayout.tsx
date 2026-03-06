import { Outlet } from 'react-router-dom';
import CoachSidebar from '@/components/navigation/CoachSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function CoachLayout() {
  const { profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <CoachSidebar />
      
      {/* Mobile header */}
      <div className="flex-1 flex flex-col">
        <header className="h-14 flex items-center justify-between px-4 border-b border-border md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-display font-bold text-primary">RowIQ</span>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-card border-b border-border p-3 space-y-1 animate-fade-in">
            {[
              { to: '/coach/dashboard', label: 'Dashboard' },
              { to: '/coach/sessions', label: 'Sessions' },
              { to: '/coach/roster', label: 'Roster' },
              { to: '/coach/calendar', label: 'Calendar' },
              { to: '/coach/analytics', label: 'Analytics' },
            ].map(item => (
              <a key={item.to} href={item.to} className="block px-3 py-2 rounded-lg text-sm hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <button onClick={signOut} className="block w-full text-left px-3 py-2 rounded-lg text-sm text-destructive hover:bg-muted">
              Sign Out
            </button>
          </div>
        )}

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
