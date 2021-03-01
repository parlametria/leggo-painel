import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoTramitacaoComponent } from './evento-tramitacao.component';

describe('EventoTramitacaoComponent', () => {
  let component: EventoTramitacaoComponent;
  let fixture: ComponentFixture<EventoTramitacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventoTramitacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoTramitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
