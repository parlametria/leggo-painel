import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisGovernismoComponent } from './vis-governismo.component';

describe('VisGovernismoComponent', () => {
  let component: VisGovernismoComponent;
  let fixture: ComponentFixture<VisGovernismoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisGovernismoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisGovernismoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
