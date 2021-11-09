import { ChangeDetectorRef, AfterContentInit, Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nest } from 'd3-collection';

import { TemasService } from '../../shared/services/temas.service';
import { ProposicoesService } from 'src/app/shared/services/proposicoes.service';
import { LocalProposicao } from 'src/app/shared/models/proposicao.model';

const d3 = Object.assign({}, { nest });

@Component({
  selector: 'app-filtro-proposicoes',
  templateUrl: './filtro-proposicoes.component.html',
  styleUrls: ['./filtro-proposicoes.component.scss']
})

export class FiltroProposicoesComponent implements OnInit, AfterContentInit, OnDestroy {

  @Input() interesse: any;
  @Input() numeroProposicoes: number;
  @Output() filterChange = new EventEmitter<any>();

  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO = 'todos';
  readonly ORDER_BY_PADRAO = 'maior-temperatura';
  readonly STATUS_PADRAO = 'tramitando';
  public temaSelecionado: string;
  public localSelecionado: LocalProposicao;

  temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }, { tema: 'destaque', tema_slug: 'destaque' }];

  locaisBusca: any[] = [{
    casa_ultimo_local: 'geral',
    nome_ultimo_local: 'geral',
    sigla_ultimo_local: 'qualquer local',
    tipo_local: 'geral'
  }];

  public orderBySelecionado: string;
  orderBy: any[] = [
    { order: 'maior temperatura', order_by: 'maior-temperatura' },
    { order: 'menor temperatura', order_by: 'menor-temperatura' },
    { order: 'maior pressão', order_by: 'maior-pressao' },
    { order: 'menor pressão', order_by: 'menor-pressao' }
  ];

  public statusSelecionado: string;
  public tramitandoSelecionado: boolean;
  public finalizadaSelecionado: boolean;
  status = [
    { statusName: 'tramitando', statusValue: 'tramitando' },
    { statusName: 'finalizadas', statusValue: 'finalizada' },
    { statusName: 'tramitando ou finalizadas', statusValue: 'todas' },
    { statusName: 'nenhuma', statusValue: 'nenhuma' }
  ];

  proposicaoPesquisada = '';
  filtro: any;

  constructor(
    private temasService: TemasService,
    private proposicoesService: ProposicoesService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.orderBySelecionado = params.orderByProp;
        this.orderBySelecionado === undefined ?
          this.orderBySelecionado = this.ORDER_BY_PADRAO : this.orderBySelecionado = this.orderBySelecionado;
        this.temaSelecionado = params.tema;
        this.temaSelecionado === undefined ?
          this.temaSelecionado = this.FILTRO_PADRAO : this.temaSelecionado = this.temaSelecionado;
        this.statusSelecionado = params.statusProp;
        if (this.statusSelecionado === undefined) {
          this.statusSelecionado = this.STATUS_PADRAO;
          this.tramitandoSelecionado = true;
          this.finalizadaSelecionado = false;
        }  else {
          if (this.statusSelecionado === 'todas') {
            this.tramitandoSelecionado = true;
            this.finalizadaSelecionado = true;
          } else {
            if (this.statusSelecionado === 'tramitando') {
              this.tramitandoSelecionado = true;
              this.finalizadaSelecionado = false;
            }
            if (this.statusSelecionado === 'finalizada') {
              this.tramitandoSelecionado = false;
              this.finalizadaSelecionado = true;
            }
          }
        }
      });
    this.localSelecionado = this.locaisBusca[0];
    this.aplicarFiltro();
  }

  ngOnChanges() {
    this.getTemas();
    this.getLocais();
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getLocais() {
    if (!this.interesse) return;
    this.proposicoesService.getListaLocaisProposicoes(this.interesse.interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(locais => {
        locais.map(l => {
          if (l.nome_ultimo_local !== null) {
            l.nome_ultimo_local = l.nome_ultimo_local.replace(/Comissão (De|Do)/g, '');
          }
        });

        locais.sort((a, b) => {
          return ('' + a.sigla_ultimo_local).localeCompare(b.sigla_ultimo_local);
        });

        locais.forEach(item => this.locaisBusca.push(item));

        this.updateFilterFromURL();
        this.aplicarFiltro();

        this.locaisBusca = d3.nest()
          .key((d: any) => d.casa_ultimo_local)
          .entries(this.locaisBusca);

      });
  }

  updateFilterFromURL() {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.orderBySelecionado = params.orderByProp;
        this.orderBySelecionado === undefined ?
          this.orderBySelecionado = this.ORDER_BY_PADRAO : this.orderBySelecionado = this.orderBySelecionado;

        this.temaSelecionado = params.tema;
        this.temaSelecionado === undefined ?
          this.temaSelecionado = this.FILTRO_PADRAO : this.temaSelecionado = this.temaSelecionado;

        this.statusSelecionado = params.statusProp;
        this.statusSelecionado === undefined ?
          this.statusSelecionado = this.STATUS_PADRAO : this.statusSelecionado = this.statusSelecionado;

        const localURL = params.local;

        if (localURL === undefined && this.localSelecionado === undefined) {
          this.localSelecionado = this.locaisBusca[0];
        } else if (localURL !== undefined) {
          if (this.localSelecionado === undefined) {
            const localSelecionado = this.locaisBusca.find(l =>
              localURL.sigla_ultimo_local === l.sigla_ultimo_local);
            this.localSelecionado = localSelecionado;
          }
        }
      });
  }

  getCasaLocal(casa: string) {
    if (casa === 'camara') {
      return 'Câmara';
    } else if (casa === 'senado') {
      return 'Senado';
    } else {
      return 'Outros';
    }
  }

  getTemas() {
    this.temasService.getTemas(this.interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(tema =>
        tema.forEach(item => this.temasBusca.push(item))
      );
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.proposicaoPesquisada,
      status: this.statusSelecionado,
      tema: this.temaSelecionado,
      local: this.localSelecionado,
      semApensada: true
    };
    this.filterChange.emit(this.filtro);
  }

  onChangeOrderBy(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.ORDER_BY_PADRAO) {
      queryParams.orderByProp = item;
    } else {
      delete queryParams.orderByProp;
    }
    this.router.navigate([], { queryParams });
  }

  onChangeStatus() {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    if (!this.tramitandoSelecionado && !this.finalizadaSelecionado) {
      this.statusSelecionado = 'nenhuma';
    } else if (this.tramitandoSelecionado && this.finalizadaSelecionado) {
      this.statusSelecionado = 'todas';
    } else {
      if (this.tramitandoSelecionado) {
        this.statusSelecionado = 'tramitando';
      }
      if (this.finalizadaSelecionado) {
        this.statusSelecionado = 'finalizada';
      }
    }

    if (this.statusSelecionado !== this.STATUS_PADRAO) {
      queryParams.statusProp = this.statusSelecionado;
    } else {
      delete queryParams.statusProp;
    }
    this.router.navigate([], { queryParams });

    this.aplicarFiltro();
  }

  onChangeTema(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.FILTRO_PADRAO) {
      queryParams.tema = item;
    } else {
      delete queryParams.tema;
    }
    this.router.navigate([], { queryParams });

    this.aplicarFiltro();
  }

  setOrdenacao(orderBy: string) {
    this.orderBySelecionado = orderBy;
    this.onChangeOrderBy(this.orderBySelecionado);
  }

  getClasseBotaoOrdenacao(orderBy: string) {
    if (orderBy === this.orderBySelecionado) {
      return 'btn btn-dark w-100';
    }
    return 'btn btn-outline-dark w-100';
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
