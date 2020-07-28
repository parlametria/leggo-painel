import { TestBed } from '@angular/core/testing';

import { ProposicoesService } from './proposicoes.service';

describe('ProposicoesService', () => {
  let service: ProposicoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposicoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
