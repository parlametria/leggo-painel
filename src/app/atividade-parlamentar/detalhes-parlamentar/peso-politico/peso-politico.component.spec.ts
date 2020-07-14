import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesoPoliticoComponent } from './peso-politico.component';

describe('PesoPoliticoComponent', () => {
  let component: PesoPoliticoComponent;
  let fixture: ComponentFixture<PesoPoliticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesoPoliticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesoPoliticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
