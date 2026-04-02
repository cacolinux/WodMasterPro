import React from 'react';
import { 
  Trophy, 
  Search, 
  Filter, 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWODStore } from '@/lib/store';
import { format } from 'date-fns';

export function Leaderboard() {
  const { results, wods, loading } = useWODStore();
  const [searchTerm, setSearchTerm] = React.useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }

  // Filter results for the most recent WOD
  const latestWod = wods[0];
  const filteredResults = results
    .filter(r => r.wod_id === latestWod?.id)
    .filter(r => r.athlete_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      // Simple sort by score (assuming rounds for now)
      const scoreA = parseInt(a.score) || 0;
      const scoreB = parseInt(b.score) || 0;
      return scoreB - scoreA;
    });

  const podium = filteredResults.slice(0, 3);
  // Reorder podium for visual display: [2, 1, 3]
  const displayPodium = [
    podium[1],
    podium[0],
    podium[2]
  ].filter(Boolean);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Leaderboard</h1>
          <p className="text-zinc-400">See how you stack up against the box.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-400 px-3 py-1">
            WOD: "{latestWod?.title || 'No WOD'}"
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Top 3 Podium */}
        {displayPodium.length > 0 && (
          <div className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPodium.map((athlete, i) => {
              const rank = podium.indexOf(athlete) + 1;
              return (
                <Card key={athlete.id} className={cn(
                  "bg-zinc-900 border-zinc-800 relative overflow-hidden",
                  rank === 1 ? "md:-mt-4 border-yellow-500/20" : ""
                )}>
                  {rank === 1 && (
                    <div className="absolute top-0 right-0 p-4">
                      <Trophy className="text-yellow-500 w-6 h-6" />
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-20 h-20 border-4 border-zinc-800">
                        <AvatarImage src={athlete.athlete_avatar} />
                        <AvatarFallback>{athlete.athlete_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2 border-zinc-900",
                        rank === 1 ? "bg-yellow-500 text-zinc-950" : "bg-zinc-800 text-zinc-400"
                      )}>
                        {rank}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-zinc-100">{athlete.athlete_name}</h3>
                      <p className="text-sm text-zinc-400 font-medium">{athlete.score}</p>
                    </div>
                    <Badge variant="secondary" className={cn(
                      "bg-zinc-800 text-zinc-400",
                      athlete.rx && "bg-zinc-100 text-zinc-950"
                    )}>
                      {athlete.rx ? "Rx" : "Scaled"}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Full Leaderboard Table */}
        <Card className="lg:col-span-4 bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-0">
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-zinc-100">Full Results</CardTitle>
              <CardDescription className="text-zinc-400">All athletes who completed this WOD.</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input 
                  placeholder="Search athletes..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-950 border-zinc-800 text-zinc-100 w-full md:w-[240px]"
                />
              </div>
              <Button variant="outline" className="border-zinc-800 bg-zinc-950 text-zinc-100 hover:bg-zinc-800">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-zinc-950/50">
                <TableRow className="border-zinc-800 hover:bg-transparent">
                  <TableHead className="w-[80px] text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Rank</TableHead>
                  <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Athlete</TableHead>
                  <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Score</TableHead>
                  <TableHead className="text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Division</TableHead>
                  <TableHead className="text-right text-zinc-400 font-bold uppercase text-[10px] tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((athlete, index) => (
                  <TableRow key={athlete.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                    <TableCell className="font-bold text-zinc-100">#{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={athlete.athlete_avatar} />
                          <AvatarFallback>{athlete.athlete_name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-zinc-100">{athlete.athlete_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-100">{athlete.score}</TableCell>
                    <TableCell>
                      <Badge variant={athlete.rx ? "default" : "secondary"} className={cn(
                        athlete.rx ? "bg-zinc-100 text-zinc-950 hover:bg-zinc-100" : "bg-zinc-800 text-zinc-400"
                      )}>
                        {athlete.rx ? "Rx" : "Scaled"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-zinc-400 text-sm">
                      {format(new Date(athlete.date), 'MMM d')}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredResults.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                      No results found for this workout.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

