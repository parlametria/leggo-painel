import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

import { indicate } from 'src/app/shared/functions/indicate.function';
import { Ator } from 'src/app/shared/models/ator.model';
import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { AtorService } from 'src/app/shared/services/ator.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorDetalhado;
  public parlamentarInfo: Ator;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;
  public destaque: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService,
    private atorService: AtorService,
    private pesoService: PesoPoliticoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
      });
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.interesse = params.interesse;
      this.tema = params.tema;
      this.destaque = this.tema === 'destaque';
      this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
      this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema, this.destaque);
    });
    this.getAtorInfo(this.idAtor, this.interesse);
  }

  routeInclude(part: string) {
    return this.router.url.includes(part);
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema, destaque) {
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');
    this.parlamentarDetalhadoService
      .getParlamentarDetalhado(idParlamentar, interesse, tema, dataInicial, dataFinal, destaque)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar;
        this.isLoading.next(false);
      });
  }

  getAtorInfo(idParlamentar, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(interesse, idParlamentar),
        this.pesoService.getPesoPoliticoById(idParlamentar)
      ]
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator = data[0][0];
        const pesoPolitico = data[1];

        ator.url_foto = this.getUrlFoto(ator);
        if (pesoPolitico.length) {
          ator.peso_politico = pesoPolitico[0].pesoPolitico;
        }

        this.parlamentarInfo = ator;
      });
  }

  private getUrlFoto(parlamentar): string {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${parlamentar.id_autor}.jpg`;
    const urlFoto = parlamentar.casa_autor === 'camara' ? urlCamara : urlSenado;

    return urlFoto;
  }

  getLabel(valor: any, messagem: string): string {
    let label = '';
    if (valor === undefined || valor === null) {
      valor = '0';
    }
    label = valor + messagem;

    return label;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
