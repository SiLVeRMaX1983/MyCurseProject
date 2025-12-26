import { TestBed } from '@angular/core/testing';
import { StorageService } from './storage';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    
    localStorage.clear();
   
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageService);
  });

  it('should add a new habit with correct structure', () => {
    // Проверяем что пусто
    expect(service['habitsSubject'].value.length).toBe(0);
    // Добавляем привычку
    service.addHabit({ name: 'Пробежка', description: 'Утро' });
    // Проверяем результат
    const habits = service['habitsSubject'].value;
    expect(habits.length).toBe(1);  //  Было 2 стало 1
    expect(habits[0].name).toBe('Пробежка');  //  Точное совпадение
    expect(habits[0].description).toBe('Утро');  //  Точное совпадение
    expect(habits[0].completedDates).toEqual([]);  //  Пустой массив
    expect(habits[0].id).toBeTruthy();
    expect(habits[0].createdAt).toBeTruthy();
  });

  it('should toggle a date in completedDates', () => {
    //  Создаем привычку в ЭТОМ тесте
    service.addHabit({ name: 'Тест', description: 'Тест описание' });
    const habitId = service['habitsSubject'].value[0].id;
    const testDate = '2025-12-24';
    //  Добавляем дату
    service.toggleHabitDate(habitId, testDate);
    expect(service['habitsSubject'].value[0].completedDates).toContain(testDate);
    //  Удаляем дату
    service.toggleHabitDate(habitId, testDate);
    expect(service['habitsSubject'].value[0].completedDates).not.toContain(testDate);
  });
});
