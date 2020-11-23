import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperaturaPressaoComponent } from './temperatura-pressao.component';

describe('TemperaturaPressaoComponent', () => {
  let component: TemperaturaPressaoComponent;
  let fixture: ComponentFixture<TemperaturaPressaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperaturaPressaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperaturaPressaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
