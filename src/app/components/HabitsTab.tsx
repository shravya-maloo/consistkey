import { useState } from 'react';
import { Habit } from '../App';
import { Plus, ChevronLeft, Trash2, Edit2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HabitsTabProps {
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

export function HabitsTab({ habits, setHabits }: HabitsTabProps) {
  const [selectedHabit, setSelectedHabit] = useState<string | null>(null);
  const [isAddingHabit, setIsAddingHabit] = useState(false);
  const [isEditingHabit, setIsEditingHabit] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily' as 'daily' | 'weekly' | 'alternate',
  });

  const handleAddHabit = () => {
    if (!formData.name.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      frequency: formData.frequency,
      startDate: formatDateLocal(toLocalDate(new Date())),
      completions: {},
    };

    setHabits([...habits, newHabit]);
    setFormData({ name: '', description: '', frequency: 'daily' });
    setIsAddingHabit(false);
  };

  const handleEditHabit = () => {
    if (!formData.name.trim() || !selectedHabit) return;

    setHabits(
      habits.map((h) =>
        h.id === selectedHabit
          ? {
              ...h,
              name: formData.name,
              description: formData.description,
              frequency: formData.frequency,
            }
          : h
      )
    );
    setIsEditingHabit(false);
    setFormData({ name: '', description: '', frequency: 'daily' });
  };

  const handleDeleteHabit = (id: string) => {
    if (window.confirm('Are you sure you want to delete this habit?')) {
      setHabits(habits.filter((h) => h.id !== id));
      setSelectedHabit(null);
    }
  };

  const startEdit = (habit: Habit) => {
    setFormData({
      name: habit.name,
      description: habit.description,
      frequency: habit.frequency,
    });
    setIsEditingHabit(true);
  };

  if (isAddingHabit || isEditingHabit) {
    return (
      <div className="bg-[#FFFBF5] rounded-lg shadow-md border border-[#E8DCC8] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => {
              setIsAddingHabit(false);
              setIsEditingHabit(false);
              setFormData({ name: '', description: '', frequency: 'daily' });
            }}
            className="p-2 hover:bg-[#F5F1E8] rounded"
          >
            <ChevronLeft className="w-5 h-5 text-[#5D4E37]" />
          </button>
          <h2 className="text-[#5D4E37]">{isEditingHabit ? 'Edit Habit' : 'Add New Habit'}</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-[#5D4E37]">Habit Name</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-[#E8DCC8] rounded focus:outline-none focus:ring-2 focus:ring-[#8B7355]" placeholder="e.g., Morning Exercise" />
          </div>

          <div>
            <label className="block mb-2 text-[#5D4E37]">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-[#E8DCC8] rounded focus:outline-none focus:ring-2 focus:ring-[#8B7355]" rows={4} placeholder="Describe your habit..." />
          </div>

          <div>
            <label className="block mb-2 text-[#5D4E37]">Frequency</label>
            <select value={formData.frequency} onChange={(e) => setFormData({ ...formData, frequency: e.target.value as 'daily' | 'weekly' | 'alternate' })} className="w-full p-3 border border-[#E8DCC8] rounded focus:outline-none focus:ring-2 focus:ring-[#8B7355]">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="alternate">Alternate Days</option>
            </select>
          </div>

          <button onClick={isEditingHabit ? handleEditHabit : handleAddHabit} className="w-full py-3 bg-[#8B7355] text-white rounded hover:bg-[#5D4E37]">
            {isEditingHabit ? 'Save Changes' : 'Add Habit'}
          </button>
        </div>
      </div>
    );
  }

  if (selectedHabit) {
    const habit = habits.find((h) => h.id === selectedHabit);
    if (!habit) return null;

    return (
      <div className="bg-[#FFFBF5] rounded-lg shadow-md border border-[#E8DCC8] p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedHabit(null)} className="p-2 hover:bg-[#F5F1E8] rounded">
            <ChevronLeft className="w-5 h-5 text-[#5D4E37]" />
          </button>
          <h2 className="text-[#5D4E37]">Habit Details</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-[#8B7355] mb-1">Name</label>
            <p className="text-[#5D4E37] break-words">{habit.name}</p>
          </div>

          <div>
            <label className="block text-[#8B7355] mb-1">Description</label>
            <p className="text-[#5D4E37] break-words">{habit.description || 'No description provided'}</p>
          </div>

          <div>
            <label className="block text-[#8B7355] mb-1">Frequency</label>
            <p className="capitalize text-[#5D4E37]">{habit.frequency === 'alternate' ? 'alternate days' : habit.frequency}</p>
          </div>

          <div>
            <label className="block text-[#8B7355] mb-1">Started On</label>
            <p className="text-[#5D4E37] text-sm sm:text-base">{new Date(habit.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div>
            <label className="block text-[#8B7355] mb-2">Progress Over Weeks</label>
            <HabitProgressChart habit={habit} />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button onClick={() => startEdit(habit)} className="flex-1 py-3 bg-[#8B7355] text-white rounded hover:bg-[#5D4E37] flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button onClick={() => handleDeleteHabit(habit.id)} className="flex-1 py-3 bg-red-600 text-white rounded hover:bg-red-700 flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFBF5] rounded-lg shadow-md border border-[#E8DCC8] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-[#5D4E37]">Your Habits</h2>
        <button onClick={() => setIsAddingHabit(true)} className="flex items-center gap-2 px-4 py-2 bg-[#8B7355] text-white rounded hover:bg-[#5D4E37] w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#8B7355] mb-4 px-4">No habits yet. Start by adding your first habit!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <div key={habit.id} onClick={() => setSelectedHabit(habit.id)} className="p-3 sm:p-4 border border-[#E8DCC8] rounded-lg cursor-pointer hover:bg-[#F5F1E8] transition">
              <div className="flex justify-between items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-[#5D4E37] break-words">{habit.name}</h4>
                  <p className="text-sm text-[#8B7355] capitalize">{habit.frequency === 'alternate' ? 'alternate days' : habit.frequency}</p>
                </div>
                <ChevronLeft className="w-5 h-5 rotate-180 text-[#8B7355] flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HabitProgressChart({ habit }: { habit: Habit }) {
  const today = toLocalDate(new Date());
  const data: { week: string; completion: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - i * 7);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday local
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    let completedDays = 0;
    let expectedDays = 0;

    for (let d = toLocalDate(weekStart); d <= toLocalDate(weekEnd); d.setDate(d.getDate() + 1)) {
      const dateLocal = toLocalDate(d);
      const dateKey = formatDateLocal(dateLocal);

      const habitStartLocal = toLocalDate(habit.startDate);

      if (dateLocal >= habitStartLocal && dateLocal <= today) {
        if (shouldCountDay(habit, dateLocal)) {
          expectedDays++;
          if (habit.completions[dateKey]) completedDays++;
        }
      }
    }

    const completionRate = expectedDays > 0 ? Math.round((completedDays / expectedDays) * 100) : 0;
    data.push({ week: `Week ${12 - i}`, completion: completionRate });
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E8DCC8" />
        <XAxis dataKey="week" stroke="#8B7355" />
        <YAxis domain={[0, 100]} stroke="#8B7355" />
        <Tooltip contentStyle={{ backgroundColor: '#FFFBF5', border: '1px solid #E8DCC8' }} />
        <Line type="monotone" dataKey="completion" stroke="#8B7355" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function shouldCountDay(habit: Habit, date: Date) {
  const startLocal = toLocalDate(habit.startDate);
  const checkLocal = toLocalDate(date);

  if (checkLocal < startLocal) return false;

  if (habit.frequency === 'daily') return true;

  if (habit.frequency === 'weekly') return checkLocal.getDay() === 6; // Saturday

  if (habit.frequency === 'alternate') {
    const daysSinceStart = daysBetween(startLocal, checkLocal);
    return daysSinceStart % 2 === 0;
  }

  return false;
}