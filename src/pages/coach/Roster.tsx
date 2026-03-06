import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function Roster() {
  const { profile } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    if (!profile?.team_id) return;
    supabase.from('profiles')
      .select('*, athlete_profiles(*)')
      .eq('team_id', profile.team_id)
      .then(({ data }) => { if (data) setAthletes(data); });

    supabase.from('teams')
      .select('invite_code')
      .eq('id', profile.team_id)
      .single()
      .then(({ data }) => { if (data) setInviteCode(data.invite_code); });
  }, [profile?.team_id]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Invite code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateCode = async () => {
    if (!profile?.team_id) return;
    setRegenerating(true);
    const newCode = Math.random().toString(36).substring(2, 10);
    const { error } = await supabase
      .from('teams')
      .update({ invite_code: newCode })
      .eq('id', profile.team_id);
    if (error) {
      toast.error('Failed to regenerate code');
    } else {
      setInviteCode(newCode);
      toast.success('New invite code generated!');
    }
    setRegenerating(false);
  };

  const grouped = athletes.reduce((acc: any, a) => {
    const boat = a.athlete_profiles?.[0]?.boat_class || 'Unassigned';
    if (!acc[boat]) acc[boat] = [];
    acc[boat].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Roster</h1>

      {/* Invite Code Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Team Invite Code</p>
              <p className="text-3xl font-mono font-bold tracking-widest text-primary">{inviteCode}</p>
              <p className="text-xs text-muted-foreground mt-1">Share this code with athletes so they can join your team</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyCode}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button variant="outline" size="sm" onClick={regenerateCode} disabled={regenerating}>
                <RefreshCw className={`h-4 w-4 mr-1 ${regenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {Object.entries(grouped).map(([boat, members]: any) => (
        <Card key={boat}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{boat}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {members.map((a: any) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.athlete_profiles?.[0]?.year} · {a.athlete_profiles?.[0]?.seat_position || 'No seat'}
                  </p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
      {athletes.length === 0 && <p className="text-muted-foreground text-center py-8">No athletes yet</p>}
    </div>
  );
}