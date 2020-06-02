import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoHeaderComponent } from './proposicao-header.component';

describe('ProposicaoHeaderComponent', () => {
  let component: ProposicaoHeaderComponent;
  let fixture: ComponentFixture<ProposicaoHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
