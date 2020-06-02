import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposicaoPageHeaderComponent } from './proposicao-page-header.component';

describe('ProposicaoPageHeaderComponent', () => {
  let component: ProposicaoPageHeaderComponent;
  let fixture: ComponentFixture<ProposicaoPageHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposicaoPageHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposicaoPageHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
