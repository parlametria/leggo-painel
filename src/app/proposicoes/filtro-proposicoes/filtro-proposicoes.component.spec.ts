import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroProposicoesComponent } from './filtro-proposicoes.component';

describe('FiltroProposicoesComponent', () => {
  let component: FiltroProposicoesComponent;
  let fixture: ComponentFixture<FiltroProposicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroProposicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroProposicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
