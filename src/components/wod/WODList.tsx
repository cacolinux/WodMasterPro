import React from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Dumbbell, 
  Clock, 
  Trophy,
  History,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useWODStore, WOD } from '@/lib/store';
import { format } from 'date-fns';

import { LogResultDialog } from './LogResultDialog';

export function WODList() {
  const { wods, addWOD, loading } = useWODStore();
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);
  const [selectedWod, setSelectedWod] = React.useState<WOD | null>(null);
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const [newWod, setNewWod] = React.useState<Partial<WOD>>({
    title: '',
    type: 'AMRAP',
    duration: '',
    description: '',
    category: 'Benchmark',
    difficulty: 'Intermediate'
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogClick = (wod: WOD) => {
    setSelectedWod(wod);
    setIsLogOpen(true);
  };

  const handleCreateWOD = () => {
    if (newWod.title && newWod.description) {
      addWOD({
        title: newWod.title!,
        type: newWod.type as any,
        duration: newWod.duration || 'N/A',
        description: newWod.description!,
        date: new Date().toISOString(),
        category: newWod.category as any,
        difficulty: newWod.difficulty as any,
      });
      setIsCreateOpen(false);
      setNewWod({
        title: '',
        type: 'AMRAP',
        duration: '',
        description: '',
        category: 'Benchmark',
        difficulty: 'Intermediate'
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Workouts</h1>
          <p className="text-zinc-400">Browse and manage your box's programming.</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200">
              <Plus className="mr-2 h-4 w-4" /> Create WOD
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Create New Workout</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title" className="text-zinc-400">Title</Label>
                <Input 
                  id="title" 
                  value={newWod.title}
                  onChange={(e) => setNewWod({ ...newWod, title: e.target.value })}
                  placeholder="e.g. Fran, Murph, The Chief" 
                  className="bg-zinc-950 border-zinc-800 text-zinc-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Type</Label>
                  <Select 
                    value={newWod.type} 
                    onValueChange={(v) => setNewWod({ ...newWod, type: v as any })}
                  >
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="AMRAP">AMRAP</SelectItem>
                      <SelectItem value="For Time">For Time</SelectItem>
                      <SelectItem value="EMOM">EMOM</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Tabata">Tabata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration" className="text-zinc-400">Duration/Volume</Label>
                  <Input 
                    id="duration" 
                    value={newWod.duration}
                    onChange={(e) => setNewWod({ ...newWod, duration: e.target.value })}
                    placeholder="e.g. 20 min, 21-15-9" 
                    className="bg-zinc-950 border-zinc-800 text-zinc-100"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description" className="text-zinc-400">Description</Label>
                <textarea 
                  id="description"
                  value={newWod.description}
                  onChange={(e) => setNewWod({ ...newWod, description: e.target.value })}
                  className="flex min-h-[120px] w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-700 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Describe the workout movements and standards..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Category</Label>
                  <Select 
                    value={newWod.category} 
                    onValueChange={(v) => setNewWod({ ...newWod, category: v as any })}
                  >
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Benchmark">Benchmark</SelectItem>
                      <SelectItem value="Conditioning">Conditioning</SelectItem>
                      <SelectItem value="Strength">Strength</SelectItem>
                      <SelectItem value="Skill">Skill</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-zinc-400">Difficulty</Label>
                  <Select 
                    value={newWod.difficulty} 
                    onValueChange={(v) => setNewWod({ ...newWod, difficulty: v as any })}
                  >
                    <SelectTrigger className="bg-zinc-950 border-zinc-800 text-zinc-100">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateOpen(false)}
                className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateWOD}
                className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold"
              >
                Create WOD
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Search workouts..." 
            className="pl-10 bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-zinc-700"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            <History className="mr-2 h-4 w-4" /> History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {wods.map((wod) => (
          <Card key={wod.id} className="bg-zinc-900 border-zinc-800 group hover:border-zinc-700 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-xl font-bold text-zinc-100">{wod.title}</CardTitle>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-300 text-[10px] uppercase font-bold">
                      {wod.category}
                    </Badge>
                  </div>
                  <CardDescription className="text-zinc-400 flex items-center gap-2">
                    <CalendarIcon size={14} />
                    {format(new Date(wod.date), 'MMM d, yyyy')}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-100">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-100">
                    <DropdownMenuItem className="hover:bg-zinc-800">Edit Workout</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800">Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-zinc-800 text-red-400">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Clock size={16} className="text-zinc-500" />
                  <span>{wod.duration}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Dumbbell size={16} className="text-zinc-500" />
                  <span>{wod.type}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Trophy size={16} className="text-zinc-500" />
                  <span>{wod.difficulty}</span>
                </div>
              </div>
              
              <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors">
                <p className="text-sm text-zinc-300 leading-relaxed italic">
                  "{wod.description}"
                </p>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => handleLogClick(wod)}
                  className="flex-1 bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-semibold"
                >
                  Log Result
                </Button>
                <Button variant="outline" className="flex-1 border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
                  Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedWod && (
        <LogResultDialog 
          wod={selectedWod} 
          isOpen={isLogOpen} 
          onOpenChange={setIsLogOpen} 
        />
      )}
    </div>
  );
}


