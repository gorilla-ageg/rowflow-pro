import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Anchor } from 'lucide-react';
import { toast } from 'sonner';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-primary flex flex-col items-center justify-center p-6">
      <div className="animate-fade-in text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Anchor className="h-12 w-12 text-primary-foreground" />
          <h1 className="font-display text-5xl font-bold text-primary-foreground tracking-tight">RowIQ</h1>
        </div>
        <p className="text-primary-foreground/80 text-lg mb-10 font-body">
          AI-powered operations platform for rowing teams
        </p>
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            variant="secondary"
            className="w-full text-base font-semibold"
            onClick={() => navigate('/signup')}
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </div>
      </div>
    </div>
  );
}
