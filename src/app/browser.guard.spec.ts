import { TestBed, async, inject } from '@angular/core/testing';

import { BrowserGuard } from './browser.guard';

describe('BrowserGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BrowserGuard]
    });
  });

  it('should ...', inject([BrowserGuard], (guard: BrowserGuard) => {
    expect(guard).toBeTruthy();
  }));
});
