import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComposicaoLinkComponent } from './composicao-link.component';

describe('ComposicaoLinkComponent', () => {
  let component: ComposicaoLinkComponent;
  let fixture: ComponentFixture<ComposicaoLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComposicaoLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComposicaoLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
