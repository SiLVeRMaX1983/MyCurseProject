import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CelebrationService {
  private celebrationSubject = new Subject<{ message: string }>();
  celebration$ = this.celebrationSubject.asObservable();

  show(message: string) {
    this.celebrationSubject.next({ message });
  }
}