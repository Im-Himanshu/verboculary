import { TestBed } from '@angular/core/testing';

import { AdmobSerService } from './admob-ser.service';

describe('AdmobSerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdmobSerService = TestBed.get(AdmobSerService);
    expect(service).toBeTruthy();
  });
});
