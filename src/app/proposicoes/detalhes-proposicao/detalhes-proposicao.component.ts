import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ProposicaoDetalhadaService } from 'src/app/shared/services/proposicao-detalhada.service';
import { EventosService } from 'src/app/shared/services/eventos.service';
import { indicate } from 'src/app/shared/functions/indicate.function';
import { Evento } from 'src/app/shared/models/evento.model';

@Component({
  selector: 'app-detalhes-proposicao',
  templateUrl: './detalhes-proposicao.component.html',
  styleUrls: ['./detalhes-proposicao.component.scss']
})
export class DetalhesProposicaoComponent implements OnInit, OnDestroy  {

  private unsubscribe = new Subject();

  public proposicao: Proposicao;
  public eventos: Evento[];
  public eventosAgrupados: any;
  public idProposicao: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private proposicaoDetalhadaService: ProposicaoDetalhadaService,
    private eventosProposicaoService: EventosService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
        this.idProposicao = params.get('id_leggo');
      });
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.tema = params.tema;
      this.tema === undefined ? this.tema = '' : this.tema = this.tema;
      this.getProposicaodetalhada(this.idProposicao, this.interesse);
      // this.getEventosProposicao(this.idProposicao, this.interesse);
    });
  }

  getProposicaodetalhada(idProposicao, interesse) {
    this.proposicaoDetalhadaService
      .getProposicaoDetalhada(idProposicao, interesse)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(proposicao => {
        this.proposicao = proposicao[0];
        this.isLoading.next(false);
      });
  }

  // private groupBy = key => array =>
  // array.reduce((objectsByKeyValue, obj) => {
  //   const value = obj[key];
  //   objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
  //   return objectsByKeyValue;
  // }, {})

  // getEventosProposicao(idProposicao, interesse) {
  //   this.eventosProposicaoService
  //     .getEventosTramitação(idProposicao, interesse)
  //     .pipe(
  //       takeUntil(this.unsubscribe))
  //     .subscribe(eventos => {
  //       this.eventos = eventos;
  //       const eventosGroupByTitulo = this.groupBy('titulo_evento');
  //       this.eventosAgrupados = eventosGroupByTitulo(eventos);
  //       console.log(this.eventosAgrupados);
  //     });
  // }

  getCasaFormatada(casa): string {
    if (casa === 'camara') {
      return 'Câmara';
    } else if (casa === 'senado') {
      return 'Senado';
    }
    return '';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
