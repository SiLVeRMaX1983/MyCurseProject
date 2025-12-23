export interface Habit {
  id: string;
  name: string;
  description?: string;
  completedDates: string[];
  createdAt: string;
}