import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaApreciacaoComponent } from './forma-apreciacao.component';

describe('FormaApreciacaoComponent', () => {
  let component: FormaApreciacaoComponent;
  let fixture: ComponentFixture<FormaApreciacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaApreciacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaApreciacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
