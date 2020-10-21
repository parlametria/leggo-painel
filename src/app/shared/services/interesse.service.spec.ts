import { TestBed } from '@angular/core/testing';

import { InteresseService } from './interesse.service';

describe('InteresseService', () => {
  let service: InteresseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InteresseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
