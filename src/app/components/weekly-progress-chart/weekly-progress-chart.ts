
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export interface WeekHistory {
  weekLabel: string;
  completed: number;
  total: number;
}

@Component({
  selector: 'app-weekly-progress-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './weekly-progress-chart.html',
  styleUrls: ['./weekly-progress-chart.scss']
})
export class WeeklyProgressChartComponent implements OnChanges {
  @Input() weeklyData: WeekHistory[] = [];

  currentWeekProgress = 0;
  avgProgress = 0;

  chartType: ChartType = 'bar';
  chartData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {};

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weeklyData']) {
      this.loadChartData();
    }
  }

  private loadChartData(): void {
    if (!this.weeklyData || this.weeklyData.length === 0) {
      this.chartData = { labels: [], datasets: [] };
      this.currentWeekProgress = 0;
      this.avgProgress = 0;
      return;
    }

    const current = this.weeklyData[this.weeklyData.length - 1];
    this.currentWeekProgress = Math.round((current.completed / current.total) * 100);
    this.avgProgress = Math.round(
      this.weeklyData.reduce((sum, week) => sum + week.completed / week.total, 0) /
        this.weeklyData.length *
        100
    );

    this.chartData = {
      labels: this.weeklyData.map(w => w.weekLabel),
      datasets: [
        {
          data: this.weeklyData.map(w => w.completed),
          backgroundColor: 'rgba(76, 175, 80, 0.9)',
          borderColor: '#ffffff',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false
        }
      ]
    };

    this.initChartOptions();

    // ✅ Принудительное обновление графика
    this.chart?.update();
  }

  private initChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const y = context.parsed.y ?? 0;
              const percent = ((y / 7) * 100).toFixed(1);
              return `${percent}% (${y}/7 дней)`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 7,
          ticks: {
            stepSize: 1,
            callback: (value: any) => `${value} дней`
          },
          grid: { color: 'rgba(255,255,255,0.1)' }
        },
        x: {
          grid: { display: false }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeOutQuart'
      }
    };
  }
}