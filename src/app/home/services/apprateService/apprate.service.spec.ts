import { TestBed } from '@angular/core/testing';

import { ApprateService } from './apprate.service';

describe('ApprateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApprateService = TestBed.get(ApprateService);
    expect(service).toBeTruthy();
  });
});
