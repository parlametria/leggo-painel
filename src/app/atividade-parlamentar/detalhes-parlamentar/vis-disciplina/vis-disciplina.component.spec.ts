import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisDisciplinaComponent } from './vis-disciplina.component';

describe('VisDisciplinaComponent', () => {
  let component: VisDisciplinaComponent;
  let fixture: ComponentFixture<VisDisciplinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisDisciplinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisDisciplinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
