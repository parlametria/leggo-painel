import { TestBed } from '@angular/core/testing';

import { PesoPoliticoService } from './peso-politico.service';

describe('PesoPoliticoService', () => {
  let service: PesoPoliticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PesoPoliticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
