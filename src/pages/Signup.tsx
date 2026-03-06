import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor } from 'lucide-react';
import { toast } from 'sonner';

export default function Signup() {
  const [step, setStep] = useState<'role' | 'details'>('role');
  const [role, setRole] = useState<'coach' | 'athlete' | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    setLoading(true);
    try {
      await signUp(email, password, name, role);
      toast.success('Account created! Check your email to verify.');
      if (role === 'coach') {
        navigate('/onboarding/coach');
      } else {
        navigate('/onboarding/athlete');
      }
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center p-6">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Anchor className="h-8 w-8 text-primary" />
            <span className="font-display text-2xl font-bold text-primary">RowIQ</span>
          </div>
          <CardTitle className="font-display text-xl">Create Account</CardTitle>
        </CardHeader>
        <CardContent>
          {step === 'role' ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">I am a…</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant={role === 'coach' ? 'default' : 'outline'}
                  className="h-24 flex flex-col gap-1"
                  onClick={() => setRole('coach')}
                >
                  <span className="text-2xl">🎯</span>
                  <span className="font-semibold">Coach</span>
                </Button>
                <Button
                  variant={role === 'athlete' ? 'default' : 'outline'}
                  className="h-24 flex flex-col gap-1"
                  onClick={() => setRole('athlete')}
                >
                  <span className="text-2xl">🚣</span>
                  <span className="font-semibold">Athlete</span>
                </Button>
              </div>
              <Button className="w-full" disabled={!role} onClick={() => setStep('details')}>
                Continue
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating account…' : 'Sign Up'}
              </Button>
              <div className="flex justify-between text-sm text-muted-foreground">
                <button type="button" onClick={() => setStep('role')} className="hover:text-primary underline">Back</button>
                <Link to="/login" className="hover:text-primary underline">Already have an account?</Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
