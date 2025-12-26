import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Habit } from '../models/habit';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  public habits$ = this.habitsSubject.asObservable();

  constructor() {
    this.loadHabits();
  }

  private toLocalDateStr(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadHabits(): void {
    try {
      const saved = localStorage.getItem('habits');
      const habits: Habit[] = saved ? JSON.parse(saved) : [];
      this.habitsSubject.next(habits);
    } catch {
      this.habitsSubject.next([]);
    }
  }

  addHabit(habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>): void {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: habit.name,
      description: habit.description,
      completedDates: [],
      createdAt: this.toLocalDateStr(new Date())
    };
    const habits = [...this.habitsSubject.value, newHabit];
    localStorage.setItem('habits', JSON.stringify(habits));
    this.habitsSubject.next(habits);
  }

  toggleHabitDate(habitId: string, date: string): void {
    const habits = this.habitsSubject.value.map(habit => {
      if (habit.id === habitId) {
        const datesSet = new Set(habit.completedDates);
        if (datesSet.has(date)) {
          datesSet.delete(date);
        } else {
          datesSet.add(date);
        }
        return { ...habit, completedDates: Array.from(datesSet).sort() };
      }
      return habit;
    });
    localStorage.setItem('habits', JSON.stringify(habits));
    this.habitsSubject.next(habits);
  }

  deleteHabit(habitId: string): void {
    const habits = this.habitsSubject.value.filter(h => h.id !== habitId);
    localStorage.setItem('habits', JSON.stringify(habits));
    this.habitsSubject.next(habits);
  }

  getStreak(habitId: string): number {
    const habit = this.habitsSubject.value.find(h => h.id === habitId);
    if (!habit) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Преобразуем строки дат в объекты Date (локальные)
    const completedDates = habit.completedDates
      .map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      })
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    let checkDate = new Date(today);

    while (streak < completedDates.length) {
      const found = completedDates.some(d =>
        d.getFullYear() === checkDate.getFullYear() &&
        d.getMonth() === checkDate.getMonth() &&
        d.getDate() === checkDate.getDate()
      );
      if (found) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }

  getWeeklyProgress(habitId: string): { 
  date: string; 
  dayName: string; 
  completed: boolean; 
  isPastOrToday: boolean; 
  isToday: boolean 
}[] {
  const habit = this.habitsSubject.value.find(h => h.id === habitId);
  if (!habit) return [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentDay = today.getDay(); // 0=вс, 1=пн, ..., 6=сб

  // Найдём понедельник текущей недели
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((currentDay + 6) % 7));
  monday.setHours(0, 0, 0, 0);

  const week: { date: string; dayName: string; completed: boolean; isPastOrToday: boolean; isToday: boolean }[] = [];
  const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const dateStr = this.toLocalDateStr(date);
    const isToday = date.getTime() === today.getTime();
    const isPastOrToday = date <= today;

    week.push({
      date: dateStr,
      dayName: dayNames[i],
      completed: habit.completedDates.includes(dateStr) && isPastOrToday,
      isPastOrToday,
      isToday
    });
  }

  return week;
}


getHistoricalWeeklyProgress(habitId: string, weeksBack = 4): { weekLabel: string; completed: number; total: number }[] {
  const habit = this.habitsSubject.value.find(h => h.id === habitId);
  if (!habit) return [];

  const completedSet = new Set(habit.completedDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weeks: { weekLabel: string; completed: number; total: number }[] = [];

  for (let w = weeksBack - 1; w >= 0; w--) {
    const weekStart = new Date(today);
    const daysSinceMonday = (today.getDay() + 6) % 7;
    weekStart.setDate(today.getDate() - daysSinceMonday - w * 7);
    weekStart.setHours(0, 0, 0, 0);

    let completedCount = 0;
    const daysInWeek = 7;

    for (let d = 0; d < daysInWeek; d++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + d);
      const dateStr = this.toLocalDateStr(date);

      if (date <= today && completedSet.has(dateStr)) {
        completedCount++;
      }
    }

    const label = `${weekStart.getDate()}.${weekStart.getMonth() + 1}`;
    weeks.push({ weekLabel: label, completed: completedCount, total: daysInWeek });
  }

  return weeks;
}

getMonthlyProgress(habitId: string): { date: string; dayName: string; completed: boolean; isToday: boolean; isPast: boolean }[] {
  const habit = this.habitsSubject.value.find(h => h.id === habitId);
  if (!habit) return [];

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // кол-во дней в месяце

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=вс, 1=пн...
  const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']; // так как getDay() возвращает 0=вс

  const monthGrid: { date: string; dayName: string; completed: boolean; isToday: boolean; isPast: boolean }[] = [];

  // Заполняем пустые дни перед 1-м числом (для выравнивания по неделям)
  for (let i = 0; i < firstDayOfMonth; i++) {
    monthGrid.push({
      date: '',
      dayName: '',
      completed: false,
      isToday: false,
      isPast: false
    });
  }

  const todayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  // Заполняем дни месяца
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(year, month, day);
    const dayOfWeek = dateObj.getDay();
    const isToday = dateStr === todayStr;
    const isPast = dateObj <= today;

    monthGrid.push({
      date: dateStr,
      dayName: dayNames[dayOfWeek],
      completed: habit.completedDates.includes(dateStr),
      isToday,
      isPast
    });
  }

  return monthGrid;
}
}