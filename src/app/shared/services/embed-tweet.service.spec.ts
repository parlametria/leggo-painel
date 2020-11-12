import { TestBed } from '@angular/core/testing';

import { EmbedTweetService } from './embed-tweet.service';

describe('EmbedTweetService', () => {
  let service: EmbedTweetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmbedTweetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
