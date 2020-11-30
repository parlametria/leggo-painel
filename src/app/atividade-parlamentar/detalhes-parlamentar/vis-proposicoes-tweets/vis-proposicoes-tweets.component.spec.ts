import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisProposicoesTweetsComponent } from './vis-proposicoes-tweets.component';

describe('VisProposicoesTweetsComponent', () => {
  let component: VisProposicoesTweetsComponent;
  let fixture: ComponentFixture<VisProposicoesTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisProposicoesTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisProposicoesTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
