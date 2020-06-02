import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoDetailedComponent } from './proposicao-detailed.component';

describe('ProposicaoDetailedComponent', () => {
  let component: ProposicaoDetailedComponent;
  let fixture: ComponentFixture<ProposicaoDetailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoDetailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoDetailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
