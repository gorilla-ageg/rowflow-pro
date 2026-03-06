import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function MorningCheckin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    sleep_hours: 7,
    sleep_quality: 3,
    energy: 3,
    stress: 3,
    motivation: 3,
    has_pain: false,
    pain_location: '',
    pain_level: 1,
    classes_today: 0,
    assignment_due: false,
    exam_this_week: false,
    note_to_coach: '',
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('morning_checkins').insert({
        athlete_id: user.id,
        ...form,
        pain_location: form.has_pain ? form.pain_location : null,
        pain_level: form.has_pain ? form.pain_level : null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <CheckCircle className="h-16 w-16 text-success mb-4" />
        <h2 className="font-display text-xl font-bold mb-2">Check-in Complete!</h2>
        <p className="text-muted-foreground mb-6">Your coach can now see your morning status.</p>
        <Button onClick={() => navigate('/athlete/today')}>Back to Today</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <h1 className="font-display text-2xl font-bold mb-4">Morning Check-in</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>Sleep Hours: {form.sleep_hours}</Label>
              <Slider min={0} max={12} step={0.5} value={[form.sleep_hours]} onValueChange={v => update('sleep_hours', v[0])} />
            </div>
            <div>
              <Label>Sleep Quality: {form.sleep_quality}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.sleep_quality]} onValueChange={v => update('sleep_quality', v[0])} />
            </div>
            <div>
              <Label>Energy Level: {form.energy}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.energy]} onValueChange={v => update('energy', v[0])} />
            </div>
            <div>
              <Label>Stress Level: {form.stress}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.stress]} onValueChange={v => update('stress', v[0])} />
            </div>
            <div>
              <Label>Motivation: {form.motivation}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.motivation]} onValueChange={v => update('motivation', v[0])} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={form.has_pain} onCheckedChange={v => update('has_pain', v)} />
              <Label>Any pain?</Label>
            </div>
            {form.has_pain && (
              <>
                <div>
                  <Label>Body Part</Label>
                  <Input value={form.pain_location} onChange={e => update('pain_location', e.target.value)} placeholder="e.g. Lower back" />
                </div>
                <div>
                  <Label>Severity: {form.pain_level}/5</Label>
                  <Slider min={1} max={5} step={1} value={[form.pain_level]} onValueChange={v => update('pain_level', v[0])} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>Classes Today</Label>
              <Input type="number" value={form.classes_today} onChange={e => update('classes_today', Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.assignment_due} onCheckedChange={v => update('assignment_due', v)} />
              <Label>Assignment due today?</Label>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.exam_this_week} onCheckedChange={v => update('exam_this_week', v)} />
              <Label>Exam this week?</Label>
            </div>
          </CardContent>
        </Card>

        <div>
          <Label>Note to Coach (optional)</Label>
          <Textarea value={form.note_to_coach} onChange={e => update('note_to_coach', e.target.value)} rows={2} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit Check-in'}
        </Button>
      </form>
    </div>
  );
}
