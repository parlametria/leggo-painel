import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosInfoComponent } from './eventos-info.component';

describe('EventosInfoComponent', () => {
  let component: EventosInfoComponent;
  let fixture: ComponentFixture<EventosInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventosInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
