import { Component, OnInit, AfterContentInit, ChangeDetectorRef, Input, Output, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { TemasService } from '../../shared/services/temas.service';
import { ProposicoesService } from '../../shared/services/proposicoes.service';
import { ParlamentaresService } from '../../shared/services/parlamentares.service';

import { FiltroLateralService } from './filtro-lateral.service';

@Component({
  selector: 'app-filtro-lateral',
  templateUrl: './filtro-lateral.component.html',
  styleUrls: ['./filtro-lateral.component.scss']
})
export class FiltroLateralComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() interesse: string;
  @Input() casa: string;
  @Input() totalParlamentares: number;
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

  nomePesquisado = '';
  filtro: any;

  constructor(
    private temasService: TemasService,
    private proposicoesService: ProposicoesService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private filtroLateralService: FiltroLateralService,
    private parlamentaresService: ParlamentaresService,
  ) {
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

    this.filtroLateralService.selectedOrder
      .subscribe(selectedOrder => {
        if (selectedOrder === undefined) {
          return;
        }

        const { orderBy, orderType } = this.parlamentaresService.getOrderValues();

        if (selectedOrder.ordering !== orderBy) {
          this.parlamentaresService.setOrderBy(selectedOrder.ordering);
        }

        if (selectedOrder.orderType !== orderType) {
          this.parlamentaresService.setOrderType(selectedOrder.orderType);
        }
      });

    this.filtroLateralService.selectedPartido
      .subscribe(partido => {
        this.parlamentaresService.setPartido(partido?.sigla);
      });

    this.filtroLateralService.selectedEstado
      .subscribe(estado => {
        this.parlamentaresService.setEstado(estado);
      });
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
      this.orderBySelecionado = item;
    } else {
      delete queryParams.orderBy;
      this.orderBySelecionado = this.ORDER_BY_PADRAO;
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
    const ordenacaoGeral = ['peso-politico', 'maior-governismo', 'menor-governismo', 'maior-disciplina', 'menor-disciplina'];
    return ordenacaoGeral.includes(this.orderBySelecionado);
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

  resetFilters() {
    this.filtroLateralService.resetValuesToDefault();
  }
}
