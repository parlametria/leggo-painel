import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmbedTweetComponent } from './embed-tweet.component';

describe('EmbedTweetComponent', () => {
  let component: EmbedTweetComponent;
  let fixture: ComponentFixture<EmbedTweetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmbedTweetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmbedTweetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
