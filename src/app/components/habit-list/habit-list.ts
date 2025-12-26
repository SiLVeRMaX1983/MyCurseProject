import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';

import { StorageService } from '../../services/storage';
import { Habit } from '../../models/habit';
import { WeeklyProgressChartComponent, WeekHistory } from '../weekly-progress-chart/weekly-progress-chart';
import { CelebrationComponent } from '../celebration/celebration';

interface WeekDay {
  date: string;
  dayName: string;
  completed: boolean;
  isPastOrToday: boolean;
  isToday: boolean;
}

interface MonthCell {
  date: string;
  dayName: string;
  completed: boolean;
  isToday: boolean;
  isPast: boolean;
}

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    WeeklyProgressChartComponent,
    CelebrationComponent
  ],
  templateUrl: './habit-list.html',
  styleUrls: ['./habit-list.scss']
})
export class HabitList implements OnInit, AfterViewInit, OnDestroy {
  habits: Habit[] = [];
  selectedHabitId: string | null = null;

  private sub?: Subscription;

  @ViewChild(CelebrationComponent) celebration!: CelebrationComponent;

  constructor(private storage: StorageService) {}

  ngOnInit(): void {
    this.sub = this.storage.habits$.subscribe(habits => {
      this.habits = habits;
      this.updateStreaks();
    });
  }

  ngAfterViewInit(): void {}

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  get selectedHabitName(): string {
    if (!this.selectedHabitId) return '';
    const habit = this.habits.find(h => h.id === this.selectedHabitId);
    return habit ? habit.name : '';
  }

  private updateStreaks(): void {
    this.habits.forEach(habit => {
      habit.streak = this.storage.getStreak(habit.id);
    });
  }

  deleteHabit(id: string): void {
    this.storage.deleteHabit(id);
    if (this.selectedHabitId === id) {
      this.selectedHabitId = null;
    }
  }

  selectHabit(habitId: string): void {
    this.selectedHabitId = habitId;
  }

  closeChart(): void {
    this.selectedHabitId = null;
  }

  getStreak(habitId: string): number {
    return this.storage.getStreak(habitId);
  }

  getWeeklyProgress(habitId: string): WeekDay[] {
    return this.storage.getWeeklyProgress(habitId) as WeekDay[];
  }

  getMonthlyProgress(habitId: string): MonthCell[] {
    return this.storage.getMonthlyProgress(habitId) as MonthCell[];
  }

  getWeeklyHistoricalData(habitId: string): WeekHistory[] {
    return this.storage.getHistoricalWeeklyProgress(habitId);
  }

  toggleDay(habitId: string, date: string): void {
    if (!date) return;

    this.storage.toggleHabitDate(habitId, date);

    // После toggle — проверим streak конкретной привычки
    const streak = this.getStreak(habitId);
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      habit.streak = streak;
      this.checkStreakAndCelebrate(habit);
    }
  }

  private checkStreakAndCelebrate(habit: Habit): void {
    const streak = habit.streak ?? 0;
    let message = '';

    if (streak === 5) {
      message = '🎉 Ура! 5 дней подряд!';
    } else if (streak === 10) {
      message = '🔥 Ты настоящий чемпион! 10 дней!';
    } else if (streak === 20) {
      message = '💪 Мастер дисциплины! 20 дней без сбоев!';
    } else if (streak === 30) {
      message = '🏆 БОГ ПРИВЫЧЕК! 30 дней — ты легенда!';
    }

    if (message && this.celebration) {
      this.celebration.message = message;
      this.celebration.show();
    }
  }
}
