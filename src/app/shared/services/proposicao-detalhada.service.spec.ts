import { TestBed } from '@angular/core/testing';

import { ProposicaoDetalhadaService } from './proposicao-detalhada.service';

describe('ProposicaoDetalhadaService', () => {
  let service: ProposicaoDetalhadaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposicaoDetalhadaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
