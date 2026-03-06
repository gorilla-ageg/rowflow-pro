import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Home, Activity, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { to: '/athlete/today', icon: Home, label: 'Today' },
  { to: '/athlete/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/athlete/wellness', icon: Activity, label: 'Wellness' },
  { to: '/athlete/profile', icon: User, label: 'Profile' },
];

export default function AthleteBottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map(({ to, icon: Icon, label }) => {
          const active = location.pathname.startsWith(to);
          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs font-medium transition-colors',
                active ? 'text-secondary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
