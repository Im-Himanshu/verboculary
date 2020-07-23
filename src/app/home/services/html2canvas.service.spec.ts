import { TestBed } from '@angular/core/testing';

import { Html2canvasService } from './html2canvas.service';

describe('Html2canvasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: Html2canvasService = TestBed.get(Html2canvasService);
    expect(service).toBeTruthy();
  });
});
