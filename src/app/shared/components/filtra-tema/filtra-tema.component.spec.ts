import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltraTemaComponent } from './filtra-tema.component';

describe('FiltraTemaComponent', () => {
  let component: FiltraTemaComponent;
  let fixture: ComponentFixture<FiltraTemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltraTemaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltraTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
