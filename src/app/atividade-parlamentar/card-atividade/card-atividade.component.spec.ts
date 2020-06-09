import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAtividadeComponent } from './card-atividade.component';

describe('CardAtividadeComponent', () => {
  let component: CardAtividadeComponent;
  let fixture: ComponentFixture<CardAtividadeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardAtividadeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAtividadeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
