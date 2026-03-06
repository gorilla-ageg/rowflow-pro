import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

const bodyParts = ['Head', 'Neck', 'Shoulder', 'Upper Back', 'Lower Back', 'Hip', 'Knee', 'Ankle', 'Wrist', 'Elbow', 'Ribs', 'Hamstring', 'Quad', 'Calf', 'Foot'];

export default function FlagInjury() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bodyPart, setBodyPart] = useState('');
  const [severity, setSeverity] = useState('mild');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !bodyPart) { toast.error('Select a body part'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('injuries').insert({
        athlete_id: user.id,
        body_part: bodyPart,
        severity,
        description: description || null,
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  if (submitted) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <CheckCircle className="h-16 w-16 text-success mb-4" />
      <h2 className="font-display text-xl font-bold mb-2">Injury Reported</h2>
      <p className="text-muted-foreground mb-6">Your coach has been notified.</p>
      <Button onClick={() => navigate('/athlete/today')}>Back to Today</Button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto animate-slide-up">
      <h1 className="font-display text-2xl font-bold mb-4">Flag Injury</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Card>
          <CardContent className="pt-4 space-y-4">
            <div>
              <Label>Body Part</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {bodyParts.map(bp => (
                  <Button key={bp} type="button" size="sm" variant={bodyPart === bp ? 'default' : 'outline'} onClick={() => setBodyPart(bp)}>
                    {bp}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Severity</Label>
              <div className="grid grid-cols-3 gap-2">
                {['mild', 'moderate', 'severe'].map(s => (
                  <Button key={s} type="button" size="sm" variant={severity === s ? (s === 'severe' ? 'destructive' : 'default') : 'outline'} onClick={() => setSeverity(s)} className="capitalize">{s}</Button>
                ))}
              </div>
            </div>
            <div>
              <Label>Description (optional)</Label>
              <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Describe the injury…" />
            </div>
          </CardContent>
        </Card>
        <Button type="submit" className="w-full" disabled={loading || !bodyPart}>{loading ? 'Reporting…' : 'Report Injury'}</Button>
      </form>
    </div>
  );
}
