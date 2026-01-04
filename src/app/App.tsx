import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/tabs';
import { TodayTab } from './components/TodayTab';
import { OverallTab } from './components/OverallTab';
import { ProgressTab } from './components/ProgressTab';
import { HabitsTab } from './components/HabitsTab';
import { Sun, History, TrendingUp, ListChecks } from 'lucide-react';

export interface Habit {
  id: string;
  name: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'alternate';
  startDate: string; // ISO date string (YYYY-MM-DD)
  completions: { [date: string]: boolean }; // date: ISO string -> completed
}

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return now.toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-[#F5F1E8] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-2 text-[#3D2E1F] font-bold">ConsistKey</h1>
          <p className="text-[#8B7355] mb-3 font-semibold">Consistency is key</p>
          <p className="text-[#A89174] font-semibold">{getCurrentDate()}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#E8DCC8]">
            <TabsTrigger value="today" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37]">
              <Sun className="w-4 h-4 mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="overall" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37]">
              <History className="w-4 h-4 mr-2" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="habits" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37]">
              <ListChecks className="w-4 h-4 mr-2" />
              Habits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <TodayTab habits={habits} setHabits={setHabits} />
          </TabsContent>

          <TabsContent value="overall">
            <OverallTab habits={habits} setHabits={setHabits} />
          </TabsContent>

          <TabsContent value="progress">
            <ProgressTab habits={habits} setHabits={setHabits} />
          </TabsContent>

          <TabsContent value="habits">
            <HabitsTab habits={habits} setHabits={setHabits} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}