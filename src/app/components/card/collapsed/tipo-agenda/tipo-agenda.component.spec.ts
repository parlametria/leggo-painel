import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoAgendaComponent } from './tipo-agenda.component';

describe('TipoAgendaComponent', () => {
  let component: TipoAgendaComponent;
  let fixture: ComponentFixture<TipoAgendaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoAgendaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
