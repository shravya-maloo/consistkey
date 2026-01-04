import { Habit } from '../App';
import { Check, Target } from 'lucide-react';

interface TodayTabProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

function toLocalDate(d: Date | string) {
  const dt = typeof d === 'string' ? new Date(d) : d;
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
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

export function TodayTab({ habits, setHabits }: TodayTabProps) {
  const todayLocal = toLocalDate(new Date());
  const todayKey = formatDateLocal(todayLocal);

  // Helper to check if a habit should be shown today
  const shouldShowToday = (habit: Habit): boolean => {
    const startLocal = toLocalDate(habit.startDate);
    const nowLocal = todayLocal;

    if (nowLocal < startLocal) return false;

    if (habit.frequency === 'daily') {
      return true;
    }

    if (habit.frequency === 'weekly') {
      // Show weekly habits on Saturday (last day of week)
      const todayDayOfWeek = nowLocal.getDay(); // 0 = Sun ... 6 = Sat
      if (todayDayOfWeek !== 6) {
        return false;
      }

      // Check if it's been completed this week (Sunday -> Saturday)
      const startOfWeek = new Date(nowLocal);
      startOfWeek.setDate(nowLocal.getDate() - nowLocal.getDay()); // Sunday (local)
      startOfWeek.setHours(0, 0, 0, 0);

      for (let d = toLocalDate(startOfWeek); d <= nowLocal; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDateLocal(toLocalDate(d));
        if (habit.completions[dateKey]) {
          return false; // Already completed this week
        }
      }
      return true;
    }

    if (habit.frequency === 'alternate') {
      // Calculate days since start using local-midnight normalized difference
      const daysSinceStart = daysBetween(startLocal, nowLocal);
      // Debug: log the calculation
      console.log('Alternate habit check:', {
        habitName: habit.name,
        startDate: habit.startDate,
        startLocal: startLocal.toISOString(),
        nowLocal: nowLocal.toISOString(),
        daysSinceStart,
        shouldShow: daysSinceStart % 2 === 0
      });
      return daysSinceStart % 2 === 0;
    }

    return false;
  };

  const todaysHabits = habits.filter(shouldShowToday);
  const pendingHabits = todaysHabits.filter((h) => !h.completions[todayKey]);
  const completedHabits = todaysHabits.filter((h) => !!h.completions[todayKey]);
  const allDone = todaysHabits.length > 0 && pendingHabits.length === 0;

  const toggleHabit = (habitId: string) => {
    setHabits(
      habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completions: {
                ...h.completions,
                [todayKey]: !h.completions[todayKey],
              },
            }
          : h
      )
    );
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'daily':
        return 'text-red-600';
      case 'weekly':
        return 'text-green-600';
      case 'alternate':
        return 'text-yellow-600';
      default:
        return 'text-gray-500';
    }
  };

  const getFrequencyText = (frequency: string) => {
    return frequency === 'alternate' ? 'alternate days' : frequency;
  };

  return (
    <div className="bg-[#FFFBF5] rounded-lg shadow-md border border-[#E8DCC8] p-6">
      {todaysHabits.length === 0 ? (
        <p className="text-[#8B7355] text-center py-8">No habits for today!</p>
      ) : allDone ? (
        <div>
          <div className="flex flex-col items-center justify-center py-8 mb-6 bg-[#F5F1E8] rounded-lg">
            <Target className="w-12 h-12 text-[#5D4E37] mb-3" />
            <p className="text-[#5D4E37] text-center">You are all done for today! Good job!</p>
          </div>

          {completedHabits.length > 0 && (
            <div>
              <h3 className="mb-4 text-[#5D4E37]">Completed Habits</h3>
              <div className="space-y-3">
                {completedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center gap-4 p-4 border border-[#E8DCC8] rounded-lg cursor-pointer hover:bg-[#F5F1E8] transition"
                  >
                    <div className="w-6 h-6 rounded border-2 flex items-center justify-center bg-[#8B7355] border-[#8B7355]">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="line-through text-[#A89174]">{habit.name}</p>
                      <p className={`text-sm ${getFrequencyColor(habit.frequency)}`}>{getFrequencyText(habit.frequency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          {pendingHabits.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-4 text-[#5D4E37]">Pending Habits</h3>
              <div className="space-y-3">
                {pendingHabits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center gap-4 p-4 border border-[#E8DCC8] rounded-lg cursor-pointer hover:bg-[#F5F1E8] transition"
                  >
                    <div className="w-6 h-6 rounded border-2 flex items-center justify-center border-[#8B7355]">
                      {habit.completions[todayKey] && <Check className="w-4 h-4 text-[#8B7355]" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-[#5D4E37]">{habit.name}</p>
                      <p className={`text-sm ${getFrequencyColor(habit.frequency)}`}>{getFrequencyText(habit.frequency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {completedHabits.length > 0 && (
            <div>
              <h3 className="mb-4 text-[#5D4E37]">Completed Habits</h3>
              <div className="space-y-3">
                {completedHabits.map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabit(habit.id)}
                    className="flex items-center gap-4 p-4 border border-[#E8DCC8] rounded-lg cursor-pointer hover:bg-[#F5F1E8] transition"
                  >
                    <div className="w-6 h-6 rounded border-2 flex items-center justify-center bg-[#8B7355] border-[#8B7355]">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="line-through text-[#A89174]">{habit.name}</p>
                      <p className={`text-sm ${getFrequencyColor(habit.frequency)}`}>{getFrequencyText(habit.frequency)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}