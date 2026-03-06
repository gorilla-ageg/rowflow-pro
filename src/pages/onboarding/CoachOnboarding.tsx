import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

export default function CoachOnboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [division, setDivision] = useState('');
  const [seasonStart, setSeasonStart] = useState('');
  const [seasonEnd, setSeasonEnd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data: team, error } = await supabase.from('teams').insert({
        name: teamName,
        division,
        season_start: seasonStart || null,
        season_end: seasonEnd || null,
        coach_id: user.id,
      }).select().single();
      if (error) throw error;

      await supabase.from('profiles').update({ team_id: team.id }).eq('user_id', user.id);
      await refreshProfile();
      toast.success(`Team "${teamName}" created! Invite code: ${team.invite_code}`);
      navigate('/coach/dashboard');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md animate-slide-up">
        <CardHeader>
          <CardTitle className="font-display">Set Up Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Team Name</Label>
              <Input value={teamName} onChange={e => setTeamName(e.target.value)} placeholder="e.g. UC Berkeley Rowing" required />
            </div>
            <div>
              <Label>Division</Label>
              <Input value={division} onChange={e => setDivision(e.target.value)} placeholder="e.g. NCAA Division I" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Season Start</Label>
                <Input type="date" value={seasonStart} onChange={e => setSeasonStart(e.target.value)} />
              </div>
              <div>
                <Label>Season End</Label>
                <Input type="date" value={seasonEnd} onChange={e => setSeasonEnd(e.target.value)} />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create Team'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
