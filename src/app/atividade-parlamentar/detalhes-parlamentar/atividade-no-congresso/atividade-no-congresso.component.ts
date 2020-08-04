import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-atividade-no-congresso',
  templateUrl: './atividade-no-congresso.component.html',
  styleUrls: ['./atividade-no-congresso.component.scss']
})
export class AtividadeNoCongressoComponent implements OnInit {

  private unsubscribe = new Subject();

  public idAtor: string;
  public interesse: string;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
  }


}
