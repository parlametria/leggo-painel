import { TestBed } from '@angular/core/testing';

import { TemasService } from './temas.service';

describe('TemasService', () => {
  let service: TemasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
