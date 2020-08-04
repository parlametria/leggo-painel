import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil, skip } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-papeis-importantes',
  templateUrl: './papeis-importantes.component.html',
  styleUrls: ['./papeis-importantes.component.scss']
})
export class PapeisImportantesComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: AtorDetalhado;
  public idAtor: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
        this.getParlamentarDetalhado(this.idAtor, this.interesse);
      });
  }

  getParlamentarDetalhado(idAtor, interesse) {
    this.parlamentarDetalhadoService
      .getParlamentarDetalhado(idAtor, interesse)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar[0];
        this.isLoading.next(false);
      });
  }

}
