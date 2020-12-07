import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisProposicoesComMaisTweetsComponent } from './vis-proposicoes-com-mais-tweets.component';

describe('VisProposicoesComMaisTweetsComponent', () => {
  let component: VisProposicoesComMaisTweetsComponent;
  let fixture: ComponentFixture<VisProposicoesComMaisTweetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisProposicoesComMaisTweetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisProposicoesComMaisTweetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
