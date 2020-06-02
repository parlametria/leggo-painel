import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SemanariosComponent } from './semanarios.component';

describe('SemanariosComponent', () => {
  let component: SemanariosComponent;
  let fixture: ComponentFixture<SemanariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SemanariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SemanariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
