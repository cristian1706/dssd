import { TestBed } from '@angular/core/testing';

import { BonitaService } from './bonita.service';

describe('BonitaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BonitaService = TestBed.get(BonitaService);
    expect(service).toBeTruthy();
  });
});
