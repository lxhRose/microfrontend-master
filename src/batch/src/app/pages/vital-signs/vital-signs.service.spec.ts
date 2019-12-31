import { TestBed } from '@angular/core/testing';

import { VitalSignsService } from './vital-signs.service';

describe('VitalSignsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VitalSignsService = TestBed.get(VitalSignsService);
    expect(service).toBeTruthy();
  });
});
