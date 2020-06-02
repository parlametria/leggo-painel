import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoresDetailedComponent } from './atores-detailed.component';

describe('AtoresDetailedComponent', () => {
  let component: AtoresDetailedComponent;
  let fixture: ComponentFixture<AtoresDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoresDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoresDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
