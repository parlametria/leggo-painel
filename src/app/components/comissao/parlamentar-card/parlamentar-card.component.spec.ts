import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParlamentarCardComponent } from './parlamentar-card.component';

describe('ParlamentarCardComponent', () => {
  let component: ParlamentarCardComponent;
  let fixture: ComponentFixture<ParlamentarCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParlamentarCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParlamentarCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
