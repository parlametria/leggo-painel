import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisAtividadeDetalhadaComponent } from './vis-atividade-detalhada.component';

describe('VisAtividadeDetalhadaComponent', () => {
  let component: VisAtividadeDetalhadaComponent;
  let fixture: ComponentFixture<VisAtividadeDetalhadaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisAtividadeDetalhadaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisAtividadeDetalhadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
