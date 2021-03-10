import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmentasComponent } from './ementas.component';

describe('EmentasComponent', () => {
  let component: EmentasComponent;
  let fixture: ComponentFixture<EmentasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmentasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
