import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PautasInfoComponent } from './pautas-info.component';

describe('PautasInfoComponent', () => {
  let component: PautasInfoComponent;
  let fixture: ComponentFixture<PautasInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PautasInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PautasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
