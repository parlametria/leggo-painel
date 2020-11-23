import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-filtro-proposicoes',
  templateUrl: './filtro-proposicoes.component.html',
  styleUrls: ['./filtro-proposicoes.component.scss']
})

export class FiltroProposicoesComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();
  readonly ORDER_BY_PADRAO = 'maior-temperatura';
  public orderBySelecionado: string;
  orderBy: any[] = [
    { order: 'maior temperatura', order_by: 'maior-temperatura' },
    { order: 'menor temperatura', order_by: 'menor-temperatura' },
    { order: 'maior pressão', order_by: 'maior-pressao' },
    { order: 'menor pressão', order_by: 'menor-pressao' }, ];
  proposicaoPesquisada = '';
  filtro: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.orderBySelecionado = params.orderByProp;
        this.orderBySelecionado === undefined ?
        this.orderBySelecionado = this.ORDER_BY_PADRAO : this.orderBySelecionado = this.orderBySelecionado;
      });
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.proposicaoPesquisada
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

}
