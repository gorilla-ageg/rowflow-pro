import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function EveningCheckin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    energy_final: 3,
    nutrition: 'good' as string,
    hydration: 'good' as string,
    expected_sleep: 7,
    day_rating: 3,
  });
  const update = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('evening_checkins').insert({ athlete_id: user.id, ...form });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <CheckCircle className="h-16 w-16 text-success mb-4" />
      <h2 className="font-display text-xl font-bold mb-2">Evening Check-in Done!</h2>
      <Button onClick={() => navigate('/athlete/today')}>Back to Today</Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <h1 className="font-display text-2xl font-bold mb-4">Evening Check-in</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>Energy Level: {form.energy_final}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.energy_final]} onValueChange={v => update('energy_final', v[0])} />
            </div>
            <div>
              <Label>Nutrition</Label>
              <div className="grid grid-cols-3 gap-2">
                {['good', 'okay', 'poor'].map(v => (
                  <Button key={v} type="button" size="sm" variant={form.nutrition === v ? 'default' : 'outline'} onClick={() => update('nutrition', v)} className="capitalize">{v}</Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Hydration</Label>
              <div className="grid grid-cols-3 gap-2">
                {['good', 'okay', 'poor'].map(v => (
                  <Button key={v} type="button" size="sm" variant={form.hydration === v ? 'default' : 'outline'} onClick={() => update('hydration', v)} className="capitalize">{v}</Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Expected Sleep (hrs): {form.expected_sleep}</Label>
              <Slider min={0} max={12} step={0.5} value={[form.expected_sleep]} onValueChange={v => update('expected_sleep', v[0])} />
            </div>
            <div>
              <Label>Day Rating: {form.day_rating}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.day_rating]} onValueChange={v => update('day_rating', v[0])} />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</Button>
      </form>
    </div>
  );
}
