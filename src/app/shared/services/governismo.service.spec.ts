import { TestBed } from '@angular/core/testing';

import { GovernismoService } from './governismo.service';

describe('GovernismoService', () => {
  let service: GovernismoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovernismoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
