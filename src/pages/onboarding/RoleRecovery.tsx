import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Anchor } from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type RoleOption = 'coach' | 'athlete';

export default function RoleRecovery() {
  const navigate = useNavigate();
  const { user, role, refreshProfile } = useAuth();
  const [savingRole, setSavingRole] = useState<RoleOption | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    if (role) {
      navigate('/', { replace: true });
    }
  }, [user, role, navigate]);

  const handleSelectRole = async (nextRole: RoleOption) => {
    if (!user) return;

    setSavingRole(nextRole);

    const { error } = await supabase
      .from('user_roles')
      .upsert({ user_id: user.id, role: nextRole }, { onConflict: 'user_id,role' });

    if (error) {
      toast.error('Could not complete account setup. Please try again.');
      setSavingRole(null);
      return;
    }

    await refreshProfile();
    toast.success('Account setup complete.');
    navigate('/', { replace: true });
  };

  if (!user || role) return null;

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Anchor className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-primary">RowIQ</span>
          </div>
          <CardTitle className="font-display text-xl">Choose your role to continue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            className="w-full"
            onClick={() => handleSelectRole('coach')}
            disabled={!!savingRole}
          >
            {savingRole === 'coach' ? 'Saving…' : 'I’m a Coach'}
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => handleSelectRole('athlete')}
            disabled={!!savingRole}
          >
            {savingRole === 'athlete' ? 'Saving…' : 'I’m an Athlete'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
