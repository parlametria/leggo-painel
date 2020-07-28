import { TestBed } from '@angular/core/testing';

import { ParlamentaresService } from './parlamentares.service';

describe('ParlamentaresService', () => {
  let service: ParlamentaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParlamentaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
