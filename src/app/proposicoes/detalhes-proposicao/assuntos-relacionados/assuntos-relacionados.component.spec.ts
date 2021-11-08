import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssuntosRelacionadosComponent } from './assuntos-relacionados.component';

describe('AssuntosRelacionadosComponent', () => {
  let component: AssuntosRelacionadosComponent;
  let fixture: ComponentFixture<AssuntosRelacionadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssuntosRelacionadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssuntosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
