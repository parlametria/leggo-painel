import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInsightComponent } from './card-insight.component';

describe('CardInsightComponent', () => {
  let component: CardInsightComponent;
  let fixture: ComponentFixture<CardInsightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInsightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInsightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
