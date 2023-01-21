import { TestBed } from '@angular/core/testing';

import { LegalCaseService } from '../legal-case.service';

describe('LegalCaseService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LegalCaseService = TestBed.get(LegalCaseService);
    expect(service).toBeTruthy();
  });
});
