import { TestBed } from '@angular/core/testing';

import { MoodleFileService } from './moodle-file.service';

describe('MoodleFileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoodleFileService = TestBed.get(MoodleFileService);
    expect(service).toBeTruthy();
  });
});
