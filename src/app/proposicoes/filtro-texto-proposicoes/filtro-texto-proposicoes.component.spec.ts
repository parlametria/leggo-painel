import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroTextoProposicoesComponent } from './filtro-texto-proposicoes.component';

describe('FiltroTextoProposicoesComponent', () => {
  let component: FiltroTextoProposicoesComponent;
  let fixture: ComponentFixture<FiltroTextoProposicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroTextoProposicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroTextoProposicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
