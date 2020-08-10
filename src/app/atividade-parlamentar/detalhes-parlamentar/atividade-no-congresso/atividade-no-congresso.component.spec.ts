import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtividadeNoCongressoComponent } from './atividade-no-congresso.component';

describe('AtividadeNoCongressoComponent', () => {
  let component: AtividadeNoCongressoComponent;
  let fixture: ComponentFixture<AtividadeNoCongressoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtividadeNoCongressoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtividadeNoCongressoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
