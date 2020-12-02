import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesProposicaoComponent } from './detalhes-proposicao.component';

describe('DetalhesProposicaoComponent', () => {
  let component: DetalhesProposicaoComponent;
  let fixture: ComponentFixture<DetalhesProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
