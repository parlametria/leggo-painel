import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisCabecalhoComponent } from './vis-cabecalho.component';

describe('VisCabecalhoComponent', () => {
  let component: VisCabecalhoComponent;
  let fixture: ComponentFixture<VisCabecalhoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisCabecalhoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisCabecalhoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
