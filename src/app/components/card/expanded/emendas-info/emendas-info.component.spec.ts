import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmendasInfoComponent } from './emendas-info.component';

describe('EmendasInfoComponent', () => {
  let component: EmendasInfoComponent;
  let fixture: ComponentFixture<EmendasInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmendasInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmendasInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
