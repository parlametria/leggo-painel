import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicoesComponent } from './proposicoes.component';

describe('ProposicoesComponent', () => {
  let component: ProposicoesComponent;
  let fixture: ComponentFixture<ProposicoesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicoesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
