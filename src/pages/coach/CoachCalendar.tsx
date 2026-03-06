import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format, startOfWeek, endOfWeek, addDays, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const typeColors: Record<string, string> = {
  erg: 'bg-session-erg text-white',
  water: 'bg-primary text-primary-foreground',
  weights: 'bg-session-weights text-white',
  rest: 'bg-success text-success-foreground',
  cross_training: 'bg-session-cross text-white',
};

export default function CoachCalendar() {
  const { profile } = useAuth();
  const [sessions, setSessions] = useState<any[]>([]);
  const [weekStart, setWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));

  useEffect(() => {
    if (!profile?.team_id) return;
    const start = format(weekStart, 'yyyy-MM-dd');
    const end = format(endOfWeek(weekStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
    supabase.from('sessions')
      .select('*')
      .eq('team_id', profile.team_id)
      .gte('date', start)
      .lte('date', end)
      .order('date')
      .then(({ data }) => { if (data) setSessions(data); });
  }, [profile?.team_id, weekStart]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Calendar</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(s => subWeeks(s, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d')}</span>
          <Button variant="ghost" size="icon" onClick={() => setWeekStart(s => addWeeks(s, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const daySessions = sessions.filter(s => s.date === dateStr);
          const isToday = dateStr === format(new Date(), 'yyyy-MM-dd');

          return (
            <Card key={dateStr} className={isToday ? 'border-secondary' : ''}>
              <CardHeader className="p-2 pb-1">
                <p className={`text-xs font-medium text-center ${isToday ? 'text-secondary' : 'text-muted-foreground'}`}>
                  {format(day, 'EEE')}
                </p>
                <p className={`text-lg font-bold text-center ${isToday ? 'text-secondary' : ''}`}>
                  {format(day, 'd')}
                </p>
              </CardHeader>
              <CardContent className="p-2 pt-0 space-y-1">
                {daySessions.map(s => (
                  <div key={s.id} className={`text-xs px-1.5 py-1 rounded ${typeColors[s.type] || 'bg-muted'}`}>
                    {s.type.replace('_', ' ')}
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
