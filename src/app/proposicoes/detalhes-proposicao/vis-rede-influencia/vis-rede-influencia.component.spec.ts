import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisRedeInfluenciaComponent } from './vis-rede-influencia.component';

describe('VisRedeInfluenciaComponent', () => {
  let component: VisRedeInfluenciaComponent;
  let fixture: ComponentFixture<VisRedeInfluenciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisRedeInfluenciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisRedeInfluenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
