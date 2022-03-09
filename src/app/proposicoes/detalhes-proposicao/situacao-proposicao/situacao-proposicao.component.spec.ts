import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SituacaoProposicaoComponent } from './situacao-proposicao.component';

describe('SituacaoProposicaoComponent', () => {
  let component: SituacaoProposicaoComponent;
  let fixture: ComponentFixture<SituacaoProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SituacaoProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SituacaoProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
