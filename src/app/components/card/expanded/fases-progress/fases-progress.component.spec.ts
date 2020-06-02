import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasesProgressComponent } from './fases-progress.component';

describe('FasesProgressComponent', () => {
  let component: FasesProgressComponent;
  let fixture: ComponentFixture<FasesProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasesProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasesProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
