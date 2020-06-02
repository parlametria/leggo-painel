import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoItemComponent } from './proposicao-item.component';

describe('ProposicaoItemComponent', () => {
  let component: ProposicaoItemComponent;
  let fixture: ComponentFixture<ProposicaoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
