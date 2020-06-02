import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoresInfoComponent } from './atores-info.component';

describe('AtoresInfoComponent', () => {
  let component: AtoresInfoComponent;
  let fixture: ComponentFixture<AtoresInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoresInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoresInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
