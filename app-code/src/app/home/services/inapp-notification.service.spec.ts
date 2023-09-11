import { TestBed } from '@angular/core/testing';

import { InappNotificationService } from './inapp-notification.service';

describe('InappNotificationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InappNotificationService = TestBed.get(InappNotificationService);
    expect(service).toBeTruthy();
  });
});
