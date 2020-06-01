import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadeParlamentarComponent } from './atividade-parlamentar.component';

describe('AtividadeParlamentarComponent', () => {
  let component: AtividadeParlamentarComponent;
  let fixture: ComponentFixture<AtividadeParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtividadeParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtividadeParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
