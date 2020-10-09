import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisAtividadeTwitterComponent } from './vis-atividade-twitter.component';

describe('VisAtividadeTwitterComponent', () => {
  let component: VisAtividadeTwitterComponent;
  let fixture: ComponentFixture<VisAtividadeTwitterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisAtividadeTwitterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisAtividadeTwitterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
