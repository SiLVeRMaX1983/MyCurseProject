import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-celebration',
  standalone: true,
  template: `
    <div class="celebration" [class.show]="isVisible">
      <div class="message">{{ message }}</div>
    </div>
  `,
  styles: [`
    .celebration {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.96);
      padding: 24px 32px;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      opacity: 0;
      pointer-events: none;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    .celebration.show {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
      pointer-events: auto;
    }
    .message {
      font-size: 20px;
      font-weight: bold;
      color: #2c3e50;
      text-align: center;
      line-height: 1.4;
    }
  `]
})
export class CelebrationComponent {
  @Input() message = '';
  isVisible = false;

  show() {
    this.isVisible = true;
    setTimeout(() => this.isVisible = false, 3000);
  }
}