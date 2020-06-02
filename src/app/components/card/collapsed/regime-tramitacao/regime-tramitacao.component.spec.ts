import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegimeTramitacaoComponent } from './regime-tramitacao.component';

describe('RegimeTramitacaoComponent', () => {
  let component: RegimeTramitacaoComponent;
  let fixture: ComponentFixture<RegimeTramitacaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegimeTramitacaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegimeTramitacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
