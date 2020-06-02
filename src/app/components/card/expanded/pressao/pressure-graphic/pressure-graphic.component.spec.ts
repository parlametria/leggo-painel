import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PressureGraphicComponent } from './pressure-graphic.component';

describe('PressureGraphicComponent', () => {
  let component: PressureGraphicComponent;
  let fixture: ComponentFixture<PressureGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PressureGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PressureGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
