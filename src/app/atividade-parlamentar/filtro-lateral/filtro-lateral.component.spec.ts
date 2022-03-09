import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroLateralComponent } from './filtro-lateral.component';

describe('FiltroComponent', () => {
  let component: FiltroLateralComponent;
  let fixture: ComponentFixture<FiltroLateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltroLateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroLateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
