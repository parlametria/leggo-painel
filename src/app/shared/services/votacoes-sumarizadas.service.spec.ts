import { TestBed } from '@angular/core/testing';

import { VotacoesSumarizadasService } from './votacoes-sumarizadas.service';

describe('VotacoesSumarizadasService', () => {
  let service: VotacoesSumarizadasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VotacoesSumarizadasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
