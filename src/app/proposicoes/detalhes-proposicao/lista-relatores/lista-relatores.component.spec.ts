import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaRelatoresComponent } from './lista-relatores.component';

describe('ListaRelatoresComponent', () => {
  let component: ListaRelatoresComponent;
  let fixture: ComponentFixture<ListaRelatoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaRelatoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaRelatoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
