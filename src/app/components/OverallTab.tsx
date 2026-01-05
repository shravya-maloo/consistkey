import { useState } from 'react';
import { Habit } from '../App';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface OverallTabProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

function toLocalDate(d: Date | string) {
  if (typeof d === 'string') {
    // Parse YYYY-MM-DD string as local date to avoid timezone issues
    const [year, month, day] = d.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function formatDateLocal(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function daysBetween(a: Date | string, b: Date | string) {
  const aa = toLocalDate(a);
  const bb = toLocalDate(b);
  const dayMs = 1000 * 60 * 60 * 24;
  return Math.floor((bb.getTime() - aa.getTime()) / dayMs);
}

export function OverallTab({ habits, setHabits }: OverallTabProps) {
  const toggleCompletion = (habitId: string, date: string) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completions: {
                ...h.completions,
                [date]: !h.completions[date],
              },
            }
          : h
      )
    );
  };

  return (
    <div className="bg-[#FFFBF5] rounded-lg shadow-md border border-[#E8DCC8] p-6">
      <div className="mb-6">
        <h2 className="text-[#5D4E37] font-bold text-3xl">Overall</h2>
        <p className="text-[#8B7355] mt-1 font-semibold">Catch-Up Mode: Check off days after you complete them.</p>
      </div>

      <div className="space-y-6">
        {habits.length === 0 ? (
          <p className="text-[#8B7355] text-center py-8">No habits yet. Add some in the Habits tab!</p>
        ) : (
          habits.map((habit) => <HabitCalendar key={habit.id} habit={habit} onToggle={toggleCompletion} />)
        )}
      </div>
    </div>
  );
}

interface HabitCalendarProps {
  habit: Habit;
  onToggle: (habitId: string, date: string) => void;
}

function HabitCalendar({ habit, onToggle }: HabitCalendarProps) {
  const [viewMode, setViewMode] = useState<'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  const navigateYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(newDate.getFullYear() + (direction === 'prev' ? -1 : 1));
    setCurrentDate(newDate);
  };

  return (
    <div className="border border-[#E8DCC8] rounded-lg p-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-[#5D4E37]">{habit.name}</h4>
        <div className="flex gap-2">
          <button onClick={() => setViewMode('month')} className={`px-3 py-1 rounded text-sm ${viewMode === 'month' ? 'bg-[#8B7355] text-white' : 'bg-[#E8DCC8] text-[#5D4E37]'}`}>Month</button>
          <button onClick={() => setViewMode('year')} className={`px-3 py-1 rounded text-sm ${viewMode === 'year' ? 'bg-[#8B7355] text-white' : 'bg-[#E8DCC8] text-[#5D4E37]'}`}>Year</button>
        </div>
      </div>

      {viewMode === 'month' ? (
        <MonthView habit={habit} currentDate={currentDate} onNavigate={navigateMonth} onToggle={onToggle} />
      ) : (
        <YearView habit={habit} currentDate={currentDate} onNavigate={navigateYear} onToggle={onToggle} />
      )}
    </div>
  );
}

function MonthView({ habit, currentDate, onNavigate, onToggle }: { habit: Habit; currentDate: Date; onNavigate: (dir: 'prev' | 'next') => void; onToggle: (id: string, date: string) => void; }) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const todayLocal = toLocalDate(new Date());

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onNavigate('prev')} className="p-2 hover:bg-[#F5F1E8] rounded"><ChevronLeft className="w-5 h-5 text-[#5D4E37]" /></button>
        <h4 className="text-[#5D4E37]">{monthName}</h4>
        <button onClick={() => onNavigate('next')} className="p-2 hover:bg-[#F5F1E8] rounded"><ChevronRight className="w-5 h-5 text-[#5D4E37]" /></button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs text-[#8B7355] p-1">{day}</div>
        ))}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const date = toLocalDate(new Date(year, month, day));
          const dateKey = formatDateLocal(date);
          const isCompleted = !!habit.completions[dateKey];
          const isPast = date < todayLocal;

          const shouldHaveCheckbox = shouldShowCheckboxForDate(habit, date);

          if (!shouldHaveCheckbox) {
            return <div key={day} className="aspect-square p-1 text-center text-xs text-[#D4C4A8]">{day}</div>;
          }

          return (
            <div key={day} onClick={() => onToggle(habit.id, dateKey)} className={`aspect-square p-1 rounded cursor-pointer flex items-center justify-center text-xs ${isCompleted ? 'bg-green-600 text-white' : isPast ? 'bg-red-600 text-white' : 'bg-[#E8DCC8] text-[#5D4E37] hover:bg-[#D4C4A8]'}`}>
              <input type="checkbox" checked={isCompleted} onChange={() => {}} className="pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function YearView({ habit, currentDate, onNavigate, onToggle }: { habit: Habit; currentDate: Date; onNavigate: (dir: 'prev'|'next') => void; onToggle: (id: string, date: string) => void; }) {
  const year = currentDate.getFullYear();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => onNavigate('prev')} className="p-2 hover:bg-[#F5F1E8] rounded"><ChevronLeft className="w-5 h-5 text-[#5D4E37]" /></button>
        <h4 className="text-[#5D4E37]">{year}</h4>
        <button onClick={() => onNavigate('next')} className="p-2 hover:bg-[#F5F1E8] rounded"><ChevronRight className="w-5 h-5 text-[#5D4E37]" /></button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 12 }, (_, monthIndex) => {
          const monthDate = new Date(year, monthIndex, 1);
          const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
          const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

          return (
            <div key={monthIndex} className="border border-[#E8DCC8] rounded p-2">
              <div className="text-xs text-center mb-1 text-[#5D4E37]">{monthName}</div>
              <div className="grid grid-cols-7 gap-0.5">
                {Array.from({ length: daysInMonth }, (_, day) => {
                  const date = toLocalDate(new Date(year, monthIndex, day + 1));
                  const dateKey = formatDateLocal(date);
                  const shouldHaveCheckbox = shouldShowCheckboxForDate(habit, date);
                  const isCompleted = !!habit.completions[dateKey];

                  if (!shouldHaveCheckbox) {
                    return <div key={day} className="w-2 h-2 bg-[#F5F1E8]" />;
                  }

                  return (
                    <div key={day} onClick={() => onToggle(habit.id, dateKey)} className={`w-2 h-2 cursor-pointer ${isCompleted ? 'bg-green-600' : 'bg-red-600'}`} title={`${monthName} ${day + 1}`} />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function shouldShowCheckboxForDate(habit: Habit, date: Date) {
  const startLocal = toLocalDate(habit.startDate);
  const checkLocal = toLocalDate(date);

  if (checkLocal < startLocal) return false;

  if (habit.frequency === 'daily') return true;

  if (habit.frequency === 'weekly') {
    // Weekly habits show on Saturday (last day of the week)
    return checkLocal.getDay() === 6;
  }

  if (habit.frequency === 'alternate') {
    const daysSinceStart = daysBetween(startLocal, checkLocal);
    return daysSinceStart % 2 === 0;
  }

  return false;
}