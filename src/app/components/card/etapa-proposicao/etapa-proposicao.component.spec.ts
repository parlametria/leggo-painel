import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EtapaProposicaoComponent } from './etapa-proposicao.component';

describe('EtapaProposicaoComponent', () => {
  let component: EtapaProposicaoComponent;
  let fixture: ComponentFixture<EtapaProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EtapaProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EtapaProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
