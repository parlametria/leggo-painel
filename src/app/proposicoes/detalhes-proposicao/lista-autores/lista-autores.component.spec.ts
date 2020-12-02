import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAutoresComponent } from './lista-autores.component';

describe('ListaAutoresComponent', () => {
  let component: ListaAutoresComponent;
  let fixture: ComponentFixture<ListaAutoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaAutoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaAutoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
