import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="font-display text-2xl font-bold">Analytics</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <BarChart3 className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground">Training load analytics will appear here once athletes log sessions.</p>
        </CardContent>
      </Card>
    </div>
  );
}
