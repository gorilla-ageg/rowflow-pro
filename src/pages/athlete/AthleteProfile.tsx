import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';

export default function AthleteProfile() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [athleteProfile, setAthleteProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ height: '', weight: '', boat_class: '', sleep_goal: '8' });

  useEffect(() => {
    if (!user) return;
    supabase.from('athlete_profiles').select('*').eq('user_id', user.id).maybeSingle()
      .then(({ data }) => {
        if (data) {
          setAthleteProfile(data);
          setForm({
            height: data.height?.toString() || '',
            weight: data.weight?.toString() || '',
            boat_class: data.boat_class || '',
            sleep_goal: data.sleep_goal?.toString() || '8',
          });
        }
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    const { error } = await supabase.from('athlete_profiles').update({
      height: form.height ? Number(form.height) : null,
      weight: form.weight ? Number(form.weight) : null,
      boat_class: form.boat_class,
      sleep_goal: Number(form.sleep_goal),
    }).eq('user_id', user.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Profile updated');
    setEditing(false);
    refreshProfile();
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-md mx-auto">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{profile?.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{profile?.email}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {editing ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Height (cm)</Label><Input value={form.height} onChange={e => setForm(f => ({ ...f, height: e.target.value }))} /></div>
                <div><Label>Weight (kg)</Label><Input value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} /></div>
              </div>
              <div>
                <Label>Boat Class</Label>
                <Select value={form.boat_class} onValueChange={v => setForm(f => ({ ...f, boat_class: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['1x', '2x', '2-', '4+', '4x', '4-', '8+'].map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Sleep Goal (hrs)</Label><Input value={form.sleep_goal} onChange={e => setForm(f => ({ ...f, sleep_goal: e.target.value }))} /></div>
              <div className="flex gap-2">
                <Button onClick={save} className="flex-1">Save</Button>
                <Button variant="outline" onClick={() => setEditing(false)} className="flex-1">Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Height:</span> {athleteProfile?.height || '—'} cm</div>
                <div><span className="text-muted-foreground">Weight:</span> {athleteProfile?.weight || '—'} kg</div>
                <div><span className="text-muted-foreground">Boat:</span> {athleteProfile?.boat_class || '—'}</div>
                <div><span className="text-muted-foreground">Sleep Goal:</span> {athleteProfile?.sleep_goal || 8} hrs</div>
              </div>
              <Button variant="outline" className="w-full" onClick={() => setEditing(true)}>Edit Profile</Button>
            </>
          )}
        </CardContent>
      </Card>
      <Button variant="ghost" className="w-full text-destructive" onClick={signOut}>
        <LogOut className="h-4 w-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
