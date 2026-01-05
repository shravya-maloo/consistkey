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

  // Inject manifest + favicons into head so "Add to Home Screen" uses the icon/manifest
  useEffect(() => {
    // set document title
    const prevTitle = document.title;
    document.title = 'ConsistKey';

    // helper to create/link a tag
    const createLink = (rel: string, href: string, attrs: { [k: string]: string } = {}) => {
      const el = document.createElement('link');
      el.rel = rel;
      el.href = href;
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
      return el;
    };

    // manifest
    const manifestLink = createLink('manifest', '/manifest.json');

    // apple-touch-icon (iOS)
    const appleIcon = createLink('apple-touch-icon', '/consiskeylogo.png');

    // favicon (fallback)
    const favicon = createLink('icon', '/consiskeylogo.png', { type: 'image/png' });

    // meta theme-color
    const metaTheme = document.createElement('meta');
    metaTheme.name = 'theme-color';
    metaTheme.content = '#5D4E37';
    document.head.appendChild(metaTheme);

    return () => {
      document.title = prevTitle;
      manifestLink.remove();
      appleIcon.remove();
      favicon.remove();
      metaTheme.remove();
    };
  }, []);

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
    <div className="min-h-screen bg-[#F5F1E8] p-3 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="mb-2 text-[#3D2E1F] font-bold">ConsistKey</h1>
          <p className="text-[#8B7355] mb-3 font-semibold">Consistency is key</p>
          <p className="text-[#A89174] font-semibold text-sm sm:text-base">{getCurrentDate()}</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4 sm:mb-6 bg-[#E8DCC8]">
            <TabsTrigger value="today" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37] text-xs sm:text-sm">
              <Sun className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Today
            </TabsTrigger>
            <TabsTrigger value="overall" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37] text-xs sm:text-sm">
              <History className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Overall
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37] text-xs sm:text-sm">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Progress
            </TabsTrigger>
            <TabsTrigger value="habits" className="data-[state=active]:bg-[#D4C4A8] data-[state=active]:text-[#5D4E37] text-xs sm:text-sm">
              <ListChecks className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
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