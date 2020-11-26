import { TestBed } from '@angular/core/testing';

import { TemperaturaService } from './temperatura.service';

describe('TemperaturaService', () => {
  let service: TemperaturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemperaturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
