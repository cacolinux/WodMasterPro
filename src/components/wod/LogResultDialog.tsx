import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useWODStore, WOD } from '@/lib/store';

interface LogResultDialogProps {
  wod: WOD;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogResultDialog({ wod, isOpen, onOpenChange }: LogResultDialogProps) {
  const { addResult } = useWODStore();
  const [score, setScore] = React.useState('');
  const [rx, setRx] = React.useState(true);
  const [notes, setNotes] = React.useState('');

  const handleLogResult = () => {
    if (score) {
      addResult({
        wod_id: wod.id,
        athlete_id: 'me', // In a real app, this would be the logged-in user's ID
        athlete_name: 'Alex Johnson', // Mock user name
        athlete_avatar: 'https://i.pravatar.cc/150?u=1',
        score,
        rx,
        date: new Date().toISOString(),
        notes
      });
      onOpenChange(false);
      setScore('');
      setNotes('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Log Result</DialogTitle>
          <p className="text-zinc-400 text-sm">Recording score for: <span className="text-zinc-100 font-semibold">{wod.title}</span></p>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="score" className="text-zinc-400">Score (Rounds, Time, etc.)</Label>
            <Input 
              id="score" 
              value={score}
              onChange={(e) => setScore(e.target.value)}
              placeholder="e.g. 24 Rounds, 8:45" 
              className="bg-zinc-950 border-zinc-800 text-zinc-100 h-12 text-lg font-bold"
            />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-zinc-950 rounded-xl border border-zinc-800">
            <div className="space-y-0.5">
              <Label className="text-zinc-100 font-medium">Division</Label>
              <p className="text-xs text-zinc-500">Are you performing this Rx or Scaled?</p>
            </div>
            <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              <button 
                onClick={() => setRx(true)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  rx ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Rx
              </button>
              <button 
                onClick={() => setRx(false)}
                className={cn(
                  "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                  !rx ? "bg-zinc-100 text-zinc-950" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                Scaled
              </button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes" className="text-zinc-400">Notes (Optional)</Label>
            <textarea 
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700"
              placeholder="How did it feel? Any modifications?"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleLogResult}
            className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold"
          >
            Save Result
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
