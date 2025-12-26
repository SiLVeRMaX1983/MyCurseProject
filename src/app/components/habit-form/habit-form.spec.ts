import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HabitForm } from './habit-form';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../services/storage';

describe('HabitForm', () => {
  let component: HabitForm;
  let fixture: ComponentFixture<HabitForm>;
  let storageServiceSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('StorageService', ['addHabit']);

    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      providers: [
        { provide: StorageService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(HabitForm);
    component = fixture.componentInstance;
    storageServiceSpy = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark form as invalid when name is empty', () => {
    component.habitForm.controls['description'].setValue('Пить 2л воды');
    expect(component.habitForm.valid).toBeFalse();
  });

  it('should mark form as valid when name is provided', () => {
    component.habitForm.controls['name'].setValue('Пить воду');
    component.habitForm.controls['description'].setValue('2 литра в день');
    expect(component.habitForm.valid).toBeTrue();
  });

 
  it('should call StorageService.addHabit on valid submit', () => {
    const name = 'Прогулка';
    const description = '30 минут на свежем воздухе';
    component.habitForm.setValue({ name, description });

    component.onSubmit();

    expect(storageServiceSpy.addHabit).toHaveBeenCalled();
  });

  it('should not call StorageService.addHabit if form is invalid', () => {
    component.habitForm.controls['name'].setValue('');
    component.onSubmit();

    expect(storageServiceSpy.addHabit).not.toHaveBeenCalled();
  });
});
