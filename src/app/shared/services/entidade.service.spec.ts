import { TestBed } from '@angular/core/testing';

import { EntidadeService } from './entidade.service';

describe('EntidadeService', () => {
  let service: EntidadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
