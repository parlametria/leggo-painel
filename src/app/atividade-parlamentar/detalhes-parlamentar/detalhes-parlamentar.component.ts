import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Ator } from 'src/app/shared/models/ator.model';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { indicate } from 'src/app/shared/functions/indicate.function';
import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorDetalhado;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.tema === undefined ? this.tema = '' : this.tema = this.tema;
        this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema);
      });
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema) {
    this.parlamentarDetalhadoService
      .getParlamentarDetalhado(idParlamentar, interesse, tema)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar;
        this.isLoading.next(false);
      });
  }

}
