import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Sun, Dumbbell, Moon, AlertTriangle } from 'lucide-react';

export default function AthleteToday() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [todaySession, setTodaySession] = useState<any>(null);
  const [morningDone, setMorningDone] = useState(false);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    if (!profile?.team_id || !user) return;
    Promise.all([
      supabase.from('sessions').select('*').eq('team_id', profile.team_id).eq('date', today).maybeSingle(),
      supabase.from('morning_checkins').select('id').eq('athlete_id', user.id).eq('date', today).maybeSingle(),
    ]).then(([sessionRes, checkinRes]) => {
      if (sessionRes.data) setTodaySession(sessionRes.data);
      if (checkinRes.data) setMorningDone(true);
      setLoading(false);
    });
  }, [profile?.team_id, user]);

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading…</p></div>;

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Today</h1>
      <p className="text-muted-foreground">{format(new Date(), 'EEEE, MMMM d')}</p>

      {/* Morning Check-in CTA */}
      {!morningDone && (
        <Card className="border-secondary/50 bg-secondary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Sun className="h-6 w-6 text-secondary" />
              <div>
                <p className="font-semibold text-sm">Morning Check-in</p>
                <p className="text-xs text-muted-foreground">How are you feeling today?</p>
              </div>
            </div>
            <Button size="sm" onClick={() => navigate('/athlete/checkin/morning')}>Start</Button>
          </CardContent>
        </Card>
      )}

      {morningDone && (
        <Badge variant="outline" className="text-success border-success">✓ Morning check-in complete</Badge>
      )}

      {/* Today's Session */}
      {todaySession ? (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                Today's Session
              </CardTitle>
              <Badge>{todaySession.type.replace('_', ' ')}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {todaySession.time && <p>🕐 {todaySession.time}</p>}
            {todaySession.duration && <p>⏱ {todaySession.duration} minutes</p>}
            <p className="capitalize">Intensity: {todaySession.intensity}</p>
            {todaySession.warmup && <div><p className="font-medium">Warmup</p><p className="text-muted-foreground">{todaySession.warmup}</p></div>}
            {todaySession.main_set && <div><p className="font-medium">Main Set</p><p className="text-muted-foreground">{todaySession.main_set}</p></div>}
            {todaySession.cooldown && <div><p className="font-medium">Cooldown</p><p className="text-muted-foreground">{todaySession.cooldown}</p></div>}
            {todaySession.notes_visible && todaySession.notes && (
              <div className="bg-muted p-2 rounded-lg"><p className="text-xs font-medium">Coach Notes</p><p className="text-muted-foreground text-xs">{todaySession.notes}</p></div>
            )}
            <Button className="w-full mt-2" variant="outline" onClick={() => navigate(`/athlete/checkin/post/${todaySession.id}`)}>
              Log Post-Session Check-in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            <Dumbbell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            No session scheduled today
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-auto py-3 flex-col gap-1" onClick={() => navigate('/athlete/checkin/evening')}>
          <Moon className="h-5 w-5" />
          <span className="text-xs">Evening Check-in</span>
        </Button>
        <Button variant="outline" className="h-auto py-3 flex-col gap-1 text-destructive border-destructive/30" onClick={() => navigate('/athlete/injury')}>
          <AlertTriangle className="h-5 w-5" />
          <span className="text-xs">Flag Injury</span>
        </Button>
      </div>
    </div>
  );
}
