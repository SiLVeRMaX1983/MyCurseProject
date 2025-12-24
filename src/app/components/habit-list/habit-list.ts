import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage';
import { Habit } from '../../models/habit';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CelebrationComponent } from '../celebration/celebration';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    CelebrationComponent // 👈 импортируем standalone-компонент
  ],
  templateUrl: './habit-list.html',
  styleUrls: ['./habit-list.scss']
})
export class HabitList implements OnInit, AfterViewInit {
  habits: Habit[] = [];

  @ViewChild(CelebrationComponent) celebration!: CelebrationComponent;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    // Подписываемся на обновления привычек
    this.storageService.habits$.subscribe(habits => {
      this.habits = habits;
      // Проверяем streak для каждой привычки (на случай загрузки или внешнего изменения)
      this.habits.forEach(habit => {
        const streak = this.getStreak(habit.id);
        if (habit.streak !== streak) {
          // Обновляем в модели (если нужно)
          habit.streak = streak;
          this.checkStreakAndCelebrate(habit);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    // Гарантируем, что ViewChild готов
  }

  deleteHabit(id: string): void {
    this.storageService.deleteHabit(id);
  }

  getStreak(habitId: string): number {
    return this.storageService.getStreak(habitId);
  }

  getWeeklyProgress(habitId: string) {
    return this.storageService.getWeeklyProgress(habitId);
  }

  getMonthlyProgress(habitId: string) {
    return this.storageService.getMonthlyProgress(habitId);
  }

  toggleDay(habitId: string, date: string): void {
    this.storageService.toggleHabitDate(habitId, date);

    // После toggle — проверим streak конкретной привычки
    const streak = this.getStreak(habitId);
    const habit = this.habits.find(h => h.id === habitId);
    if (habit) {
      habit.streak = streak;
      this.checkStreakAndCelebrate(habit);
    }
  }

  checkStreakAndCelebrate(habit: Habit) {
    const streak = habit.streak;
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

    if (message) {
      this.celebration.message = message;
      this.celebration.show();
    }
  }
}