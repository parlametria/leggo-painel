import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestaquesProposicaoComponent } from './destaques-proposicao.component';

describe('DestaquesProposicaoComponent', () => {
  let component: DestaquesProposicaoComponent;
  let fixture: ComponentFixture<DestaquesProposicaoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestaquesProposicaoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestaquesProposicaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
