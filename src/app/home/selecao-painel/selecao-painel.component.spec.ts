import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelecaoPainelComponent } from './selecao-painel.component';

describe('SelecaoPainelComponent', () => {
  let component: SelecaoPainelComponent;
  let fixture: ComponentFixture<SelecaoPainelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelecaoPainelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelecaoPainelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
