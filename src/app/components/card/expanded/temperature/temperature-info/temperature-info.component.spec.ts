import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureInfoComponent } from './temperature-info.component';

describe('TemperatureInfoComponent', () => {
  let component: TemperatureInfoComponent;
  let fixture: ComponentFixture<TemperatureInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
