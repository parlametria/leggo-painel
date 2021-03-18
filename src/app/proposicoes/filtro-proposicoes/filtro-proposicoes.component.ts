import { ChangeDetectorRef, AfterContentInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TemasService } from '../../shared/services/temas.service';

@Component({
  selector: 'app-filtro-proposicoes',
  templateUrl: './filtro-proposicoes.component.html',
  styleUrls: ['./filtro-proposicoes.component.scss']
})

export class FiltroProposicoesComponent implements OnInit, AfterContentInit {

  @Input() interesse: string;
  @Input() numeroProposicoes: number;
  @Output() filterChange = new EventEmitter<any>();

  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO = 'todos';
  readonly ORDER_BY_PADRAO = 'maior-temperatura';
  readonly STATUS_PADRAO = 'tramitando';
  public temaSelecionado: string;

  temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }, { tema: 'destaque', tema_slug: 'destaque' }];

  public orderBySelecionado: string;
  orderBy: any[] = [
    { order: 'maior temperatura', order_by: 'maior-temperatura' },
    { order: 'menor temperatura', order_by: 'menor-temperatura' },
    { order: 'maior pressão', order_by: 'maior-pressao' },
    { order: 'menor pressão', order_by: 'menor-pressao' }
  ];

  public statusSelecionado: string;
  status = [
    { statusName: 'tramitando', statusValue: 'tramitando' },
    { statusName: 'finalizadas', statusValue: 'finalizada' },
    { statusName: 'tramitando ou finalizadas', statusValue: 'todas' }
  ];

  proposicaoPesquisada = '';
  filtro: any;

  constructor(
    private temasService: TemasService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) {}

  ngOnInit(): void {
    this.getTemas();
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

  aplicarFiltro() {
    this.filtro = {
      nome: this.proposicaoPesquisada,
      status: this.statusSelecionado,
      tema: this.temaSelecionado
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

  onChangeStatus(status: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (status !== this.STATUS_PADRAO) {
      queryParams.statusProp = status;
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

}
