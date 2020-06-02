import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComissaoComponent } from './comissao.component';

describe('ComissaoComponent', () => {
  let component: ComissaoComponent;
  let fixture: ComponentFixture<ComissaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComissaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComissaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
