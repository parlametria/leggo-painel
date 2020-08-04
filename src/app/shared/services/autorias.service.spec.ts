import { TestBed } from '@angular/core/testing';

import { AutoriasService } from './autorias.service';

describe('AutoriasService', () => {
  let service: AutoriasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoriasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
