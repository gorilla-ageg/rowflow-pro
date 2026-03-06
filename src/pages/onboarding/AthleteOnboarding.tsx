import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function AthleteOnboarding() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [inviteCode, setInviteCode] = useState('');
  const [teamId, setTeamId] = useState<string | null>(null);
  const [year, setYear] = useState('');
  const [boatClass, setBoatClass] = useState('');
  const [seatPosition, setSeatPosition] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [classesPerDay, setClassesPerDay] = useState('');
  const [sleepGoal, setSleepGoal] = useState('8');
  const [loading, setLoading] = useState(false);

  const joinTeam = async () => {
    setLoading(true);
    try {
      const { data: team, error } = await supabase
        .from('teams')
        .select('id, name')
        .eq('invite_code', inviteCode.trim())
        .maybeSingle();
      if (error) throw error;
      if (!team) { toast.error('Invalid invite code'); setLoading(false); return; }
      
      await supabase.from('profiles').update({ team_id: team.id }).eq('user_id', user!.id);
      setTeamId(team.id);
      toast.success(`Joined ${team.name}!`);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const completeProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('athlete_profiles').insert({
        user_id: user.id,
        year,
        boat_class: boatClass,
        seat_position: seatPosition,
        height: height ? Number(height) : null,
        weight: weight ? Number(weight) : null,
        classes_per_day: classesPerDay ? Number(classesPerDay) : null,
        sleep_goal: Number(sleepGoal),
      });
      if (error) throw error;
      await refreshProfile();
      toast.success('Profile complete!');
      navigate('/athlete/today');
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
          <CardTitle className="font-display">
            {step === 1 ? 'Join Your Team' : 'Complete Your Profile'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <div className="space-y-4">
              <div>
                <Label>Team Invite Code</Label>
                <Input value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Enter code from your coach" />
              </div>
              <Button className="w-full" disabled={!inviteCode || loading} onClick={joinTeam}>
                {loading ? 'Joining…' : 'Join Team'}
              </Button>
            </div>
          ) : (
            <form onSubmit={completeProfile} className="space-y-4">
              <div>
                <Label>Year</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                  <SelectContent>
                    {['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate'].map(y => (
                      <SelectItem key={y} value={y}>{y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Boat Class</Label>
                  <Select value={boatClass} onValueChange={setBoatClass}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['1x', '2x', '2-', '4+', '4x', '4-', '8+'].map(b => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Seat Position</Label>
                  <Input value={seatPosition} onChange={e => setSeatPosition(e.target.value)} placeholder="e.g. Stroke" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Height (cm)</Label>
                  <Input type="number" value={height} onChange={e => setHeight(e.target.value)} />
                </div>
                <div>
                  <Label>Weight (kg)</Label>
                  <Input type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Classes/Day</Label>
                  <Input type="number" value={classesPerDay} onChange={e => setClassesPerDay(e.target.value)} />
                </div>
                <div>
                  <Label>Sleep Goal (hrs)</Label>
                  <Input type="number" value={sleepGoal} onChange={e => setSleepGoal(e.target.value)} />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Saving…' : 'Complete Setup'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
