import { TestBed } from '@angular/core/testing';

import { DatabaseService } from './data-base.service';

describe('DataBaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DatabaseService = TestBed.get(DatabaseService);
    expect(service).toBeTruthy();
  });
});
