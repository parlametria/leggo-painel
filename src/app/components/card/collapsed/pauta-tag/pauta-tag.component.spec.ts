import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PautaTagComponent } from './pauta-tag.component';

describe('PautaTagComponent', () => {
  let component: PautaTagComponent;
  let fixture: ComponentFixture<PautaTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PautaTagComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PautaTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
