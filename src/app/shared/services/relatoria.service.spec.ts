import { TestBed } from '@angular/core/testing';

import { RelatoriaService } from './relatoria.service';

describe('RelatoriaService', () => {
  let service: RelatoriaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelatoriaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
