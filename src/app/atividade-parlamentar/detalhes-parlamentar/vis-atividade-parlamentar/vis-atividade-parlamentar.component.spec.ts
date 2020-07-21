import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisAtividadeParlamentarComponent } from './vis-atividade-parlamentar.component';

describe('VisAtividadeParlamentarComponent', () => {
  let component: VisAtividadeParlamentarComponent;
  let fixture: ComponentFixture<VisAtividadeParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisAtividadeParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisAtividadeParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
