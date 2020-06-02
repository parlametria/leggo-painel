import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposicaoComponent } from './composicao.component';

describe('ComposicaoComponent', () => {
  let component: ComposicaoComponent;
  let fixture: ComponentFixture<ComposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
