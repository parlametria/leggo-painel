import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardGridProposicaoComponent } from './card-grid-proposicao.component';

describe('CardGridProposicaoComponent', () => {
  let component: CardGridProposicaoComponent;
  let fixture: ComponentFixture<CardGridProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardGridProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardGridProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
