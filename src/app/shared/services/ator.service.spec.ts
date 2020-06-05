import { TestBed } from '@angular/core/testing';

import { AtorService } from './ator.service';

describe('AtorService', () => {
  let service: AtorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AtorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
