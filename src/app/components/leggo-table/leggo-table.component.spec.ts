import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeggoTableComponent } from './leggo-table.component';

describe('LeggoTableComponent', () => {
  let component: LeggoTableComponent;
  let fixture: ComponentFixture<LeggoTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeggoTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeggoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
