import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

export default function SessionBuilder() {
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    type: 'erg',
    date: new Date().toISOString().split('T')[0],
    time: '',
    duration: '',
    intensity: 'moderate',
    warmup: '',
    main_set: '',
    cooldown: '',
    target_split: '',
    target_rate: '',
    target_hr_zone: '',
    assigned_to: 'team',
    notes: '',
    notes_visible: false,
  });
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.team_id) { toast.error('No team found'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('sessions').insert({
        team_id: profile.team_id,
        coach_id: user!.id,
        type: form.type,
        date: form.date,
        time: form.time || null,
        duration: form.duration ? Number(form.duration) : null,
        intensity: form.intensity,
        warmup: form.warmup || null,
        main_set: form.main_set || null,
        cooldown: form.cooldown || null,
        target_split: form.target_split || null,
        target_rate: form.target_rate || null,
        target_hr_zone: form.target_hr_zone || null,
        assigned_to: form.assigned_to,
        notes: form.notes || null,
        notes_visible: form.notes_visible,
      });
      if (error) throw error;
      toast.success('Session created!');
      setForm(f => ({ ...f, warmup: '', main_set: '', cooldown: '', notes: '', target_split: '', target_rate: '', target_hr_zone: '' }));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Create Training Session</h1>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Session Type</Label>
                <Select value={form.type} onValueChange={v => update('type', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erg">Erg</SelectItem>
                    <SelectItem value="water">Water</SelectItem>
                    <SelectItem value="weights">Weights</SelectItem>
                    <SelectItem value="cross_training">Cross Training</SelectItem>
                    <SelectItem value="rest">Rest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Intensity</Label>
                <Select value={form.intensity} onValueChange={v => update('intensity', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="race_pace">Race Pace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={e => update('date', e.target.value)} required />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={form.time} onChange={e => update('time', e.target.value)} />
              </div>
              <div>
                <Label>Duration (min)</Label>
                <Input type="number" value={form.duration} onChange={e => update('duration', e.target.value)} />
              </div>
            </div>

            <div>
              <Label>Warmup</Label>
              <Textarea value={form.warmup} onChange={e => update('warmup', e.target.value)} rows={2} />
            </div>
            <div>
              <Label>Main Set</Label>
              <Textarea value={form.main_set} onChange={e => update('main_set', e.target.value)} rows={3} />
            </div>
            <div>
              <Label>Cooldown</Label>
              <Textarea value={form.cooldown} onChange={e => update('cooldown', e.target.value)} rows={2} />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Target Split</Label>
                <Input value={form.target_split} onChange={e => update('target_split', e.target.value)} placeholder="e.g. 1:45" />
              </div>
              <div>
                <Label>Stroke Rate</Label>
                <Input value={form.target_rate} onChange={e => update('target_rate', e.target.value)} placeholder="e.g. 28" />
              </div>
              <div>
                <Label>HR Zone</Label>
                <Input value={form.target_hr_zone} onChange={e => update('target_hr_zone', e.target.value)} placeholder="e.g. Zone 3" />
              </div>
            </div>

            <div>
              <Label>Coach Notes</Label>
              <Textarea value={form.notes} onChange={e => update('notes', e.target.value)} rows={2} />
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.notes_visible} onCheckedChange={v => update('notes_visible', v)} />
              <Label>Make notes visible to athletes</Label>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating…' : 'Create Session'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
