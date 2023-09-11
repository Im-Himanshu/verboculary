import { TestBed } from '@angular/core/testing';

import { FirebaseOperationsService } from './firebase-operations.service';

describe('FirebaseOperationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseOperationsService = TestBed.get(FirebaseOperationsService);
    expect(service).toBeTruthy();
  });
});
