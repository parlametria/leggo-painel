import { TestBed } from '@angular/core/testing';

import { ParlamentarDetalhadoService } from './parlamentar-detalhado.service';

describe('ParlamentarDetalhadoService', () => {
  let service: ParlamentarDetalhadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParlamentarDetalhadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
