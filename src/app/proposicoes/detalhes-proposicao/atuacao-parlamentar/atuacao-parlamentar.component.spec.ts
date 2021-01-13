import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtuacaoParlamentarComponent } from './atuacao-parlamentar.component';

describe('AtuacaoParlamentarComponent', () => {
  let component: AtuacaoParlamentarComponent;
  let fixture: ComponentFixture<AtuacaoParlamentarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtuacaoParlamentarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtuacaoParlamentarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
