import { TestBed } from '@angular/core/testing';

import { ThemeChangeService } from './theme-change.service';

describe('ThemeChangeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ThemeChangeService = TestBed.get(ThemeChangeService);
    expect(service).toBeTruthy();
  });
});
