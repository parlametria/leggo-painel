import { TestBed } from '@angular/core/testing';

import { ComissaoService } from './comissao.service';

describe('ComissaoService', () => {
  let service: ComissaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComissaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
