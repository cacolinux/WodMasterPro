import React from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const performanceData = [
  { day: 'Mon', weight: 185 },
  { day: 'Tue', weight: 190 },
  { day: 'Wed', weight: 188 },
  { day: 'Thu', weight: 195 },
  { day: 'Fri', weight: 205 },
  { day: 'Sat', weight: 200 },
  { day: 'Sun', weight: 210 },
];

const upcomingClasses = [
  { id: 1, name: 'CrossFit WOD', time: '06:00 AM', coach: 'Coach Mike', spots: 8 },
  { id: 2, name: 'Weightlifting', time: '08:00 AM', coach: 'Coach Sarah', spots: 4 },
  { id: 3, name: 'CrossFit WOD', time: '10:00 AM', coach: 'Coach Mike', spots: 12 },
  { id: 4, name: 'Mobility', time: '12:00 PM', coach: 'Coach Anna', spots: 15 },
];

import { useWODStore } from '@/lib/store';
import { LogResultDialog } from '../wod/LogResultDialog';

export function Dashboard() {
  const { wods, results, loading } = useWODStore();
  const [isLogOpen, setIsLogOpen] = React.useState(false);
  const latestWod = wods[0];

  // Calculate stats
  const classesAttended = results.length;
  const prsSet = results.filter(r => r.rx).length; // Mock logic for PRs

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-zinc-800 border-t-zinc-100 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Welcome back, Alex</h1>
          <p className="text-zinc-400">Here's what's happening at the box today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            View Schedule
          </Button>
          <Button 
            onClick={() => setIsLogOpen(true)}
            className="bg-zinc-100 text-zinc-950 hover:bg-zinc-200"
          >
            Log Result
          </Button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Classes Attended', value: classesAttended.toString(), icon: Calendar, trend: '+2 this week' },
          { label: 'PRs Set', value: prsSet.toString(), icon: Trophy, trend: '+1 this month' },
          { label: 'Active Athletes', value: '142', icon: Users, trend: '+5 new' },
          { label: 'Avg. Attendance', value: '88%', icon: TrendingUp, trend: '+2%' },
        ].map((stat, i) => (
          <Card key={i} className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  <stat.icon className="w-5 h-5 text-zinc-100" />
                </div>
                <Badge variant="outline" className="border-zinc-700 text-zinc-400 text-[10px] uppercase tracking-wider">
                  {stat.trend}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-bold text-zinc-100">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's WOD */}
        <Card className="lg:col-span-2 bg-zinc-900 border-zinc-800 overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-zinc-100 text-zinc-950 hover:bg-zinc-100">Today's WOD</Badge>
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl font-bold text-zinc-100">"{latestWod?.title || 'No WOD'}"</CardTitle>
            <CardDescription className="text-zinc-400">{latestWod?.category} - {latestWod?.type}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-zinc-950/50 p-6 rounded-xl border border-zinc-800 space-y-4">
              <div className="space-y-2">
                <p className="text-zinc-100 font-medium leading-relaxed whitespace-pre-wrap">
                  {latestWod?.description}
                </p>
              </div>
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{latestWod?.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy size={16} />
                  <span>{latestWod?.difficulty}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-zinc-100 uppercase tracking-wider">Performance History</h4>
              <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f4f4f5" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f4f4f5" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis 
                      dataKey="day" 
                      stroke="#71717a" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      stroke="#71717a" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `${value}lb`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px' }}
                      itemStyle={{ color: '#f4f4f5' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#f4f4f5" 
                      strokeWidth={2}
                      fillOpacity={1} 
                      fill="url(#colorWeight)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-zinc-100">Upcoming Classes</CardTitle>
            <CardDescription className="text-zinc-400">Don't miss your next session.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div 
                key={cls.id} 
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-zinc-950 rounded-lg flex flex-col items-center justify-center text-[10px] font-bold border border-zinc-800">
                    <span className="text-zinc-400 uppercase">{cls.time.split(' ')[1]}</span>
                    <span className="text-zinc-100">{cls.time.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-100">{cls.name}</p>
                    <p className="text-xs text-zinc-400">{cls.coach}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-zinc-400 mb-1">{cls.spots} spots left</p>
                  <Button size="sm" variant="outline" className="h-7 text-[10px] uppercase tracking-wider border-zinc-700 hover:bg-zinc-100 hover:text-zinc-950">
                    Book
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-zinc-400 hover:text-zinc-100 mt-2">
              View Full Schedule
            </Button>
          </CardContent>
        </Card>
      </div>

      {latestWod && (
        <LogResultDialog 
          wod={latestWod} 
          isOpen={isLogOpen} 
          onOpenChange={setIsLogOpen} 
        />
      )}
    </div>
  );
}

