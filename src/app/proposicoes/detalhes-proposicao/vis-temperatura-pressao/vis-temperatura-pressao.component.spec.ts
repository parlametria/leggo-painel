import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisTemperaturaPressaoComponent } from './vis-temperatura-pressao.component';

describe('VisTemperaturaPressaoComponent', () => {
  let component: VisTemperaturaPressaoComponent;
  let fixture: ComponentFixture<VisTemperaturaPressaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisTemperaturaPressaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisTemperaturaPressaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
