import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoExpandedComponent } from './proposicao-expanded.component';

describe('ProposicaoExpandedComponent', () => {
  let component: ProposicaoExpandedComponent;
  let fixture: ComponentFixture<ProposicaoExpandedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoExpandedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoExpandedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
