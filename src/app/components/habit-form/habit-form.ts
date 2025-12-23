import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { StorageService } from '../../services/storage';

@Component({
  selector: 'app-habit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './habit-form.html',
  styleUrls: ['./habit-form.scss']
})
export class HabitForm {
  habitForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private storageService: StorageService
  ) {
    this.habitForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit() {
    if (this.habitForm.valid) {
      this.storageService.addHabit(this.habitForm.value);
      this.habitForm.reset();
    }
  }
}