import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaLocaisAtuaisComponent } from './lista-locais-atuais.component';

describe('ListaLocaisAtuaisComponent', () => {
  let component: ListaLocaisAtuaisComponent;
  let fixture: ComponentFixture<ListaLocaisAtuaisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaLocaisAtuaisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaLocaisAtuaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
