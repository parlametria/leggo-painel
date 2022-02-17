import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

type PossibleOrderings
  = 'peso-politico'
  | 'governismo'
  | 'disciplina-partidaria'
  | 'atividade-no-twitter';

type OrderType =  'menor' | 'maior';

type SelectedOrder = {
  ordering: PossibleOrderings,
  orderType: OrderType
};

@Component({
  selector: 'app-bloco-ordenacao',
  templateUrl: './bloco-ordenacao.component.html',
  styleUrls: ['./bloco-ordenacao.component.scss']
})
export class BlocoOrdenacaoComponent implements OnInit {
  @Input() clearFilters: EventEmitter<boolean>;

  /*
  orderBy: any[] = [
    { order: 'mais atuantes', order_by: 'atuacao-parlamentar' },
    { order: 'mais ativos no twitter', order_by: 'atuacao-twitter' },
    { order: 'com maior peso político', order_by: 'peso-politico' },
    { order: 'com maior governismo', order_by: 'maior-governismo' },
    { order: 'com menor governismo', order_by: 'menor-governismo' },
    { order: 'com maior disciplina', order_by: 'maior-disciplina' },
    { order: 'com menor disciplina', order_by: 'menor-disciplina' }];
  */
  orderBy: { order: string, order_by: PossibleOrderings }[] = [
    { order: 'Peso político', order_by: 'peso-politico' },
    { order: 'Governismo', order_by: 'governismo' },
    { order: 'Disciplina Partidária', order_by: 'disciplina-partidaria' },
    { order: 'Atividade no Twitter', order_by: 'atividade-no-twitter' },
  ];

  currentSelected?: SelectedOrder;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.clearFilters
      .subscribe((clear: boolean) => {
        if (clear === true) {
          this.resetCurrentSelected();
        }
      });
  }

  private resetCurrentSelected() {
    this.currentSelected = undefined;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = undefined;
    queryParams.orderType = undefined;

    const { scrollX, scrollY } = window;
    this.router.navigate([], { queryParams })
      .then(() => {
        window.scrollTo(scrollX, scrollY);
      });
  }

  setOrder(ordering: PossibleOrderings, orderType: OrderType) {
    this.currentSelected = { ordering, orderType };

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.orderBy = this.currentSelected.ordering;
    queryParams.orderType = this.currentSelected.orderType;

    const { scrollX, scrollY } = window;
    this.router.navigate([], { queryParams })
      .then(() => {
        window.scrollTo(scrollX, scrollY);
      });
  }

  checkSelectedOrder(ordering: PossibleOrderings, orderType: OrderType) {
    if (this.currentSelected === undefined) {
      return false;
    }

    return this.currentSelected.ordering === ordering && this.currentSelected.orderType === orderType;
  }
}
