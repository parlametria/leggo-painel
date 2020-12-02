import { TestBed } from '@angular/core/testing';

import { ProgressoService } from './progresso.service';

describe('ProgressoService', () => {
  let service: ProgressoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
