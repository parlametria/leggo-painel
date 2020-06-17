import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesParlamentarComponent } from './detalhes-parlamentar.component';

describe('DetalhesParlamentarComponent', () => {
  let component: DetalhesParlamentarComponent;
  let fixture: ComponentFixture<DetalhesParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalhesParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalhesParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
