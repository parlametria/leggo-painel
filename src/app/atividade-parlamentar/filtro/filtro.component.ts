import { Component, OnInit, AfterContentInit, ChangeDetectorRef, Input, Output, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { TemasService } from '../../shared/services/temas.service';
import { ProposicoesService } from '../../shared/services/proposicoes.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() interesse: string;
  @Output() filterChange = new EventEmitter<any>();

  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO = 'todos';
  readonly ORDER_BY_PADRAO = 'atuacao-parlamentar';
  public temaSelecionado: string;
  public casaSelecionada: string;
  public orderBySelecionado: string;

  numeroProposicoes: number;

  temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }, { tema: 'destaque', tema_slug: 'destaque' }];
  casaBusca: any[] = [
    { casa: 'Parlamentares', casa_slug: 'todos' },
    { casa: 'Deputados', casa_slug: 'camara' },
    { casa: 'Senadores', casa_slug: 'senado' }];
  orderBy: any[] = [
    { order: 'mais atuantes', order_by: 'atuacao-parlamentar' },
    { order: 'mais ativos no twitter', order_by: 'atuacao-twitter' },
    { order: 'com maior peso político', order_by: 'peso-politico' },
    { order: 'com maior governismo', order_by: 'governismo' },
    { order: 'com maior disciplina', order_by: 'disciplina' }];

  nomePesquisado = '';
  filtro: any;

  constructor(
    private temasService: TemasService,
    private proposicoesService: ProposicoesService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) {

    this.filtro = {
      nome: ''
    };
  }

  ngOnInit(): void {
    this.getTemas();
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.temaSelecionado = params.tema;
        this.casaSelecionada = params.casa;
        this.orderBySelecionado = params.orderBy;
        this.temaSelecionado === undefined ? this.temaSelecionado = this.FILTRO_PADRAO : this.temaSelecionado = this.temaSelecionado;
        this.casaSelecionada === undefined ? this.casaSelecionada = this.FILTRO_PADRAO : this.casaSelecionada = this.casaSelecionada;
        this.orderBySelecionado === undefined ?
        this.orderBySelecionado = this.ORDER_BY_PADRAO : this.orderBySelecionado = this.orderBySelecionado;
        this.getContagemProposicoes(this.interesse, this.temaSelecionado);
      });
    this.aplicarFiltro();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getTemas() {
    this.temasService.getTemas(this.interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(tema =>
        tema.forEach(item => this.temasBusca.push(item))
      );
  }

  onChangeTema(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.FILTRO_PADRAO) {
      queryParams.tema = item;
    } else {
      delete queryParams.tema;
    }
    this.router.navigate([], { queryParams });
  }

  onChangeCasa(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.FILTRO_PADRAO) {
      queryParams.casa = item;
    } else {
      delete queryParams.casa;
    }
    this.router.navigate([], { queryParams });
  }

  onChangeOrderBy(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.ORDER_BY_PADRAO) {
      queryParams.orderBy = item;
    } else {
      delete queryParams.orderBy;
    }
    this.router.navigate([], { queryParams });
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.nomePesquisado
    };

    this.filterChange.emit(this.filtro);
  }

  desabilitaSelecaoTemas() {
    return (this.orderBySelecionado === 'peso-politico' || this.orderBySelecionado === 'governismo' || this.orderBySelecionado === 'disciplina');
  }

  getContagemProposicoes(interesse: string, tema: string) {
    const destaque = tema === 'destaque';
    if (tema === this.FILTRO_PADRAO || tema === undefined || destaque) {
      tema = '';
    }

    this.proposicoesService.getContagemProposicoes(interesse, tema, destaque)
      .pipe(take(1))
      .subscribe(count => {
        this.numeroProposicoes = count.numero_proposicoes;
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
