import { TestBed } from '@angular/core/testing';

import { TextToLSJsonService } from '../text-to-lsjson.service';

describe('TextToLSJsonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextToLSJsonService = TestBed.get(TextToLSJsonService);
    expect(service).toBeTruthy();
  });
});
