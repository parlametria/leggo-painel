import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UltimosEventosComponent } from './ultimos-eventos.component';

describe('UltimosEventosComponent', () => {
  let component: UltimosEventosComponent;
  let fixture: ComponentFixture<UltimosEventosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UltimosEventosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimosEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
