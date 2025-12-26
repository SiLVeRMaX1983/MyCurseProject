import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitList } from './habit-list';
import { StorageService } from '../../services/storage';
import { BehaviorSubject } from 'rxjs';
import { Habit } from '../../models/habit';
import { CelebrationComponent } from '../celebration/celebration';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

describe('HabitList', () => {
  let component: HabitList;
  let fixture: ComponentFixture<HabitList>;
  let storageServiceMock: any;

  const mockHabits: Habit[] = [
    {
      id: '1',
      name: 'Пить воду',
      description: '2 литра в день',
      completedDates: ['2025-04-01', '2025-04-02', '2025-04-03'],
      createdAt: '2025-04-01'
    }
  ];

  beforeEach(() => {
    const habitsSubject = new BehaviorSubject<Habit[]>(mockHabits);
    storageServiceMock = {
      habits$: habitsSubject.asObservable(),
      getStreak: jasmine.createSpy('getStreak').and.returnValue(3),
      getWeeklyProgress: jasmine.createSpy('getWeeklyProgress').and.returnValue(
        Array(7).fill(null).map((_, i) => ({
          date: `2025-04-${String(i + 1).padStart(2, '0')}`,
          dayName: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][i],
          completed: i < 3,
          isPastOrToday: true,
          isToday: i === 2
        }))
      ),
      getMonthlyProgress: jasmine.createSpy('getMonthlyProgress').and.returnValue(
        Array(35).fill(null).map((_, i) => {
          if (i < 5) {
            return { date: '', dayName: '', completed: false, isToday: false, isPast: false };
          }
          const day = i - 4;
          return {
            date: day <= 30 ? `2025-04-${String(day).padStart(2, '0')}` : '',
            dayName: '',
            completed: day <= 3,
            isToday: day === 3,
            isPast: day <= 3
          };
        })
      ),
      deleteHabit: jasmine.createSpy('deleteHabit'),
      toggleHabitDate: jasmine.createSpy('toggleHabitDate')
    };

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        CelebrationComponent
      ],
      providers: [
        { provide: StorageService, useValue: storageServiceMock }
      ]
    });

    fixture = TestBed.createComponent(HabitList);
    component = fixture.componentInstance;
    
    // ✅ КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: подписываемся вручную перед detectChanges
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load habits on init', () => {
    expect(component.habits.length).toBe(1);
    expect(component.habits[0].name).toBe('Пить воду');
  });
});
