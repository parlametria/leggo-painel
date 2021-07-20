import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RedeInfluenciaComponent } from './rede-influencia.component';

describe('RedeInfluenciaComponent', () => {
  let component: RedeInfluenciaComponent;
  let fixture: ComponentFixture<RedeInfluenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RedeInfluenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RedeInfluenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
