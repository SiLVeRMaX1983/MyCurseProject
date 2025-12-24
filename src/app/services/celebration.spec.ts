import { TestBed } from '@angular/core/testing';
import { CelebrationService } from './celebration';

describe('CelebrationService', () => {
  let service: CelebrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CelebrationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit messages', () => {
    let message = '';
    service.celebration$.subscribe((event) => {
      message = event.message;
    });

    const testMessage = 'Great job!';
    service.show(testMessage);

    expect(message).toBe(testMessage);
  });
});