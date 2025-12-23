import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage';
import { Habit } from '../../models/habit';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-habit-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './habit-list.html',
  styleUrls: ['./habit-list.scss']
})
export class HabitList implements OnInit {
  habits: Habit[] = [];

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.storageService.habits$.subscribe(habits => {
      this.habits = habits;
    });
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
  toggleDay(habitId: string, date: string): void {
  this.storageService.toggleHabitDate(habitId, date);
}
getMonthlyProgress(habitId: string) {
  return this.storageService.getMonthlyProgress(habitId);
}
}