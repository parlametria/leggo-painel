import { TestBed } from '@angular/core/testing';

import { ProposicoesListaService } from './proposicoes-lista.service';

describe('ProposicoesListaService', () => {
  let service: ProposicoesListaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposicoesListaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
