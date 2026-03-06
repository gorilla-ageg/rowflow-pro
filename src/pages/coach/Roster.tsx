import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Roster() {
  const { profile } = useAuth();
  const [athletes, setAthletes] = useState<any[]>([]);

  useEffect(() => {
    if (!profile?.team_id) return;
    supabase.from('profiles')
      .select('*, athlete_profiles(*)')
      .eq('team_id', profile.team_id)
      .then(({ data }) => { if (data) setAthletes(data); });
  }, [profile?.team_id]);

  const grouped = athletes.reduce((acc: any, a) => {
    const boat = a.athlete_profiles?.[0]?.boat_class || 'Unassigned';
    if (!acc[boat]) acc[boat] = [];
    acc[boat].push(a);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Roster</h1>
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
