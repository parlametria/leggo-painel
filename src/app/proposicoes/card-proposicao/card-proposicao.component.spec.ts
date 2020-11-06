import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProposicaoComponent } from './card-proposicao.component';

describe('CardProposicaoComponent', () => {
  let component: CardProposicaoComponent;
  let fixture: ComponentFixture<CardProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
