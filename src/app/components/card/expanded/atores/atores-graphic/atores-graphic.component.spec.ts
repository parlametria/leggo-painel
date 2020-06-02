import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtoresGraphicComponent } from './atores-graphic.component';

describe('AtoresGraphicComponent', () => {
  let component: AtoresGraphicComponent;
  let fixture: ComponentFixture<AtoresGraphicComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtoresGraphicComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtoresGraphicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
