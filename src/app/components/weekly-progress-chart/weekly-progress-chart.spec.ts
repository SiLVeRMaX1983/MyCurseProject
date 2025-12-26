import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyProgressChart } from './weekly-progress-chart';

describe('WeeklyProgressChart', () => {
  let component: WeeklyProgressChart;
  let fixture: ComponentFixture<WeeklyProgressChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeeklyProgressChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeeklyProgressChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
