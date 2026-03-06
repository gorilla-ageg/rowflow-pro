import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Users, Calendar, BarChart3, LogOut, Anchor, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const items = [
  { to: '/coach/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/coach/sessions', icon: Dumbbell, label: 'Sessions' },
  { to: '/coach/roster', icon: Users, label: 'Roster' },
  { to: '/coach/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/coach/analytics', icon: BarChart3, label: 'Analytics' },
];

export default function CoachSidebar() {
  const location = useLocation();
  const { signOut, profile } = useAuth();

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
      <div className="p-6 flex items-center gap-3">
        <Anchor className="h-8 w-8 text-sidebar-primary" />
        <span className="font-display text-xl font-bold text-sidebar-primary">RowIQ</span>
      </div>
      
      {profile && (
        <div className="px-6 pb-4">
          <p className="text-sm text-sidebar-foreground/70 truncate">{profile.name}</p>
        </div>
      )}

      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 mt-auto">
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
