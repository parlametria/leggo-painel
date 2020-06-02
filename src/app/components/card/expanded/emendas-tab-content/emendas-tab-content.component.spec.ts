import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmendasTabContentComponent } from './emendas-tab-content.component';

describe('EmendasTabContentComponent', () => {
  let component: EmendasTabContentComponent;
  let fixture: ComponentFixture<EmendasTabContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmendasTabContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmendasTabContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
