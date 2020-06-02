import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TabAtoresGraphicsComponent } from './tab-atores-graphics.component';

describe('TabAtoresGraphicsComponent', () => {
  let component: TabAtoresGraphicsComponent;
  let fixture: ComponentFixture<TabAtoresGraphicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TabAtoresGraphicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabAtoresGraphicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
