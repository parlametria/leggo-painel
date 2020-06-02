import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoriasComponent } from './autorias.component';

describe('AutoriasComponent', () => {
  let component: AutoriasComponent;
  let fixture: ComponentFixture<AutoriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
