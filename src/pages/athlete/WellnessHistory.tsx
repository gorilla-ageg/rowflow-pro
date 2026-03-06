import { Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function WellnessHistory() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Wellness History</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Activity className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">Your wellness trends will appear here after a few days of check-ins.</p>
        </CardContent>
      </Card>
    </div>
  );
}
