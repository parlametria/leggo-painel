import { Component, OnInit, AfterContentInit, ChangeDetectorRef, Input, Output, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { TemasService } from '../../shared/services/temas.service';
import { ProposicoesService } from '../../shared/services/proposicoes.service';
import { ParlamentaresService } from '../../shared/services/parlamentares.service';
import { ComissaoService } from '../../shared/services/comissao.service';
import { ParlamentaresPerfilParlamentarService } from 'src/app/shared/services/parlamentares-perfil-parlamentar.service';

import { FiltroLateralService } from './filtro-lateral.service';

@Component({
  selector: 'app-filtro-lateral',
  templateUrl: './filtro-lateral.component.html',
  styleUrls: ['./filtro-lateral.component.scss']
})
export class FiltroLateralComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() interesse: string;
  @Input() casa: 'senado' | 'camara';
  @Input() totalParlamentares: number;
  // @Output() filterChange = new EventEmitter<any>();

  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO = 'todos';
  readonly ORDER_BY_PADRAO = 'atuacao-parlamentar';
  public temaSelecionado: string;
  public casaSelecionada: string;
  public orderBySelecionado: string;

  numeroProposicoes: number;

  // temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }, { tema: 'destaque', tema_slug: 'destaque' }];
  /*casaBusca: any[] = [
    { casa: 'Parlamentares', casa_slug: 'todos' },
    { casa: 'Deputados', casa_slug: 'camara' },
    { casa: 'Senadores', casa_slug: 'senado' }];
  */
  // nomePesquisado = '';
  // filtro: any;

  constructor(
    private proposicoesService: ProposicoesService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private filtroLateralService: FiltroLateralService,
    private parlamentaresService: ParlamentaresService,
    private comissaoService: ComissaoService,
    private parlamentaresPerfilParlamentarService: ParlamentaresPerfilParlamentarService,
  ) {
    /*
    this.filtro = {
      nome: ''
    };
    */
  }

  ngOnInit(): void {
    // this.getTemas();
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

    /**
     * TODO: When API adds leaderships to parliamentarians, then fetching
     * the parliamentarians with leaderships from perfil-parlamentar API won't
     * be necessary anymore.
     */
    this.parlamentaresPerfilParlamentarService.getParlamentarsWithLeadership()
      .subscribe(parlamentares => {
        this.filtroLateralService.setParlamentaresComLideranca(parlamentares);
      });

    this.setupFiltroLateralObservers();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
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

  private setupFiltroLateralObservers() {
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
        if (partido === undefined) {
          this.filtroLateralService.removerFiltrarPorPartido();
        } else {
          this.filtroLateralService.filtrarPorPartido(partido);
        }

        this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
      });

    this.filtroLateralService.selectedEstado
      .subscribe(estado => {
        if (estado === undefined) {
          this.filtroLateralService.removerFiltrarPorEstado();
        } else {
          this.filtroLateralService.filtrarPorEstado(estado);
        }

        this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
      });

    this.filtroLateralService.selectedComissao
      .subscribe(comissao => {
        if (comissao === undefined) {
          this.filtroLateralService.removerFiltrarPorComissao();
          this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
          return;
        }

        this.comissaoService.getParlamentaresComissao(this.casa, comissao.sigla)
          .subscribe(parlamentares => {
            this.filtroLateralService.setParlamentaresComissao(parlamentares);
            this.filtroLateralService.filtrarPorComissao();
            this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
          });
      });

    this.filtroLateralService.selectedCargo
      .subscribe(lideranca => {
        const comissao = this.filtroLateralService.selectedComissao.value;

        if (comissao === undefined) {
          console.log('comissao is undefined at cargo selecion');
          return;
        }

        if (lideranca === undefined) {
          this.filtroLateralService.removerFiltrarPorCargo();
        } else {
          this.filtroLateralService.filtrarPorCargo(lideranca);
        }

        this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
      });

    this.filtroLateralService.selectedLiderancas
      .subscribe(liderancas => {
        if (liderancas.length === 0) {
          this.filtroLateralService.removerFiltrarPorLiderancas();
        } else {
          this.filtroLateralService.filtrarPorLiderancas(liderancas);
        }

        this.parlamentaresService.setFiltroDeParlamentares(this.filtroLateralService.getFiltro());
      });
  }
}
