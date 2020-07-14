import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PapeisImportantesComponent } from './papeis-importantes.component';

describe('PapeisImportantesComponent', () => {
  let component: PapeisImportantesComponent;
  let fixture: ComponentFixture<PapeisImportantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PapeisImportantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PapeisImportantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
