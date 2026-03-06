import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

export default function PostSessionCheckin() {
  const { user } = useAuth();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    completion_status: 'fully_completed' as string,
    dnf_reason: '',
    rpe: 5,
    legs_fatigue: 3,
    back_fatigue: 3,
    breathing: 3,
    has_pain: false,
    pain_location: '',
    pain_level: 1,
    hit_targets: 'yes' as string,
    felt_good: '',
    felt_off: '',
    recovery_status: 3,
    ready_tomorrow: 'yes' as string,
    studying_tonight: false,
    study_hours: 0,
    academic_stress: 3,
    message_to_coach: '',
  });

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('post_session_checkins').insert({
        athlete_id: user.id,
        session_id: sessionId || null,
        ...form,
        pain_location: form.has_pain ? form.pain_location : null,
        pain_level: form.has_pain ? form.pain_level : null,
        study_hours: form.studying_tonight ? form.study_hours : null,
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
        <h2 className="font-display text-xl font-bold mb-2">Post-Session Logged!</h2>
        <Button onClick={() => navigate('/athlete/today')}>Back to Today</Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <h1 className="font-display text-2xl font-bold mb-4">Post-Session Check-in</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="pt-4 space-y-3">
            <Label>Completion</Label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'fully_completed', label: 'Full' },
                { value: 'partially', label: 'Partial' },
                { value: 'did_not_complete', label: 'DNF' },
              ].map(opt => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={form.completion_status === opt.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => update('completion_status', opt.value)}
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>RPE: {form.rpe}/10</Label>
              <Slider min={1} max={10} step={1} value={[form.rpe]} onValueChange={v => update('rpe', v[0])} />
            </div>
            <div>
              <Label>Legs Fatigue: {form.legs_fatigue}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.legs_fatigue]} onValueChange={v => update('legs_fatigue', v[0])} />
            </div>
            <div>
              <Label>Back/Core Fatigue: {form.back_fatigue}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.back_fatigue]} onValueChange={v => update('back_fatigue', v[0])} />
            </div>
            <div>
              <Label>Breathing: {form.breathing}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.breathing]} onValueChange={v => update('breathing', v[0])} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <Label>Hit Target Splits?</Label>
            <div className="grid grid-cols-3 gap-2">
              {['yes', 'close', 'no'].map(v => (
                <Button key={v} type="button" size="sm" variant={form.hit_targets === v ? 'default' : 'outline'} onClick={() => update('hit_targets', v)} className="capitalize">{v}</Button>
              ))}
            </div>
            <div>
              <Label>What felt good?</Label>
              <Textarea value={form.felt_good} onChange={e => update('felt_good', e.target.value)} rows={2} />
            </div>
            <div>
              <Label>What felt off?</Label>
              <Textarea value={form.felt_off} onChange={e => update('felt_off', e.target.value)} rows={2} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>Recovery Status: {form.recovery_status}/5</Label>
              <Slider min={1} max={5} step={1} value={[form.recovery_status]} onValueChange={v => update('recovery_status', v[0])} />
            </div>
            <Label>Ready for tomorrow?</Label>
            <div className="grid grid-cols-3 gap-2">
              {['yes', 'maybe', 'no'].map(v => (
                <Button key={v} type="button" size="sm" variant={form.ready_tomorrow === v ? 'default' : 'outline'} onClick={() => update('ready_tomorrow', v)} className="capitalize">{v}</Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Switch checked={form.studying_tonight} onCheckedChange={v => update('studying_tonight', v)} />
              <Label>Studying tonight?</Label>
            </div>
            {form.studying_tonight && (
              <>
                <div>
                  <Label>Study Hours</Label>
                  <Input type="number" value={form.study_hours} onChange={e => update('study_hours', Number(e.target.value))} />
                </div>
                <div>
                  <Label>Academic Stress: {form.academic_stress}/5</Label>
                  <Slider min={1} max={5} step={1} value={[form.academic_stress]} onValueChange={v => update('academic_stress', v[0])} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <div>
          <Label>Message to Coach (optional)</Label>
          <Textarea value={form.message_to_coach} onChange={e => update('message_to_coach', e.target.value)} rows={2} />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Submitting…' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
