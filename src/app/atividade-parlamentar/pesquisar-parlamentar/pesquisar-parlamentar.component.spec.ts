import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesquisarParlamentarComponent } from './pesquisar-parlamentar.component';

describe('PesquisarParlamentarComponent', () => {
  let component: PesquisarParlamentarComponent;
  let fixture: ComponentFixture<PesquisarParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesquisarParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesquisarParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
