import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureGraphicComponent } from './temperature-graphic.component';

describe('TemperatureGraphicComponent', () => {
  let component: TemperatureGraphicComponent;
  let fixture: ComponentFixture<TemperatureGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
