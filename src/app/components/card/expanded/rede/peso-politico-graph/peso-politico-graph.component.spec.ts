import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PesoPoliticoGraphComponent } from './peso-politico-graph.component';

describe('PesoPoliticoGraphComponent', () => {
  let component: PesoPoliticoGraphComponent;
  let fixture: ComponentFixture<PesoPoliticoGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PesoPoliticoGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PesoPoliticoGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
