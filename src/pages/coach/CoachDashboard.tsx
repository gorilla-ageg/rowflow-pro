import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Zap, AlertTriangle, GraduationCap, Users } from 'lucide-react';

export default function CoachDashboard() {
  const { user, profile } = useAuth();
  const [team, setTeam] = useState<any>(null);
  const [athletes, setAthletes] = useState<any[]>([]);
  const [checkins, setCheckins] = useState<any[]>([]);
  const [injuries, setInjuries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.team_id) return;
    const fetchData = async () => {
      const [teamRes, athletesRes, checkinsRes, injuriesRes] = await Promise.all([
        supabase.from('teams').select('*').eq('id', profile.team_id).single(),
        supabase.from('profiles').select('*, athlete_profiles(*)').eq('team_id', profile.team_id).neq('user_id', user!.id),
        supabase.from('morning_checkins').select('*').eq('date', new Date().toISOString().split('T')[0]),
        supabase.from('injuries').select('*, profiles!injuries_athlete_id_fkey(name)').eq('resolved', false),
      ]);
      if (teamRes.data) setTeam(teamRes.data);
      if (athletesRes.data) setAthletes(athletesRes.data);
      if (checkinsRes.data) setCheckins(checkinsRes.data);
      if (injuriesRes.data) setInjuries(injuriesRes.data);
      setLoading(false);
    };
    fetchData();
  }, [profile?.team_id]);

  const avgSleep = checkins.length ? (checkins.reduce((s, c) => s + (c.sleep_hours || 0), 0) / checkins.length).toFixed(1) : '—';
  const avgEnergy = checkins.length ? (checkins.reduce((s, c) => s + (c.energy || 0), 0) / checkins.length).toFixed(1) : '—';
  const avgStress = checkins.length ? (checkins.reduce((s, c) => s + (c.stress || 0), 0) / checkins.length).toFixed(1) : '—';

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading…</p></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl font-bold">{team?.name || 'Dashboard'}</h1>
        {team?.invite_code && (
          <p className="text-sm text-muted-foreground mt-1">
            Invite code: <span className="font-mono font-semibold text-foreground">{team.invite_code}</span>
          </p>
        )}
      </div>

      {/* Wellness Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <Moon className="h-5 w-5 mx-auto text-secondary mb-1" />
            <p className="text-2xl font-bold font-display">{avgSleep}</p>
            <p className="text-xs text-muted-foreground">Avg Sleep (hrs)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Zap className="h-5 w-5 mx-auto text-secondary mb-1" />
            <p className="text-2xl font-bold font-display">{avgEnergy}</p>
            <p className="text-xs text-muted-foreground">Avg Energy</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <AlertTriangle className="h-5 w-5 mx-auto text-destructive mb-1" />
            <p className="text-2xl font-bold font-display">{avgStress}</p>
            <p className="text-xs text-muted-foreground">Avg Stress</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <Users className="h-5 w-5 mx-auto text-success mb-1" />
            <p className="text-2xl font-bold font-display">{athletes.length}</p>
            <p className="text-xs text-muted-foreground">Athletes</p>
          </CardContent>
        </Card>
      </div>

      {/* Red Flags */}
      {injuries.length > 0 && (
        <Card className="border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" /> Red Flags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {injuries.map((inj: any) => (
              <div key={inj.id} className="flex items-center justify-between text-sm">
                <span>{(inj as any).profiles?.name || 'Athlete'} — {inj.body_part}</span>
                <Badge variant="destructive">{inj.severity}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Athletes List */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Team Roster</CardTitle>
        </CardHeader>
        <CardContent>
          {athletes.length === 0 ? (
            <p className="text-sm text-muted-foreground">No athletes have joined yet. Share your invite code!</p>
          ) : (
            <div className="space-y-2">
              {athletes.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <p className="font-medium text-sm">{a.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {a.athlete_profiles?.[0]?.boat_class || 'No boat'} · {a.athlete_profiles?.[0]?.year || ''}
                    </p>
                  </div>
                  <Badge variant="secondary">Active</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
