import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemperatureSortComponent } from './temperature-sort.component';

describe('TemperatureSortComponent', () => {
  let component: TemperatureSortComponent;
  let fixture: ComponentFixture<TemperatureSortComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureSortComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemperatureSortComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
