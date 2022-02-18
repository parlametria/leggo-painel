import { Component, OnInit } from '@angular/core';

import {
  FiltroLateralService,
  PossibleOrderings,
  SelectedOrder,
  OrderType
} from '../filtro-lateral.service';


@Component({
  selector: 'app-bloco-ordenacao',
  templateUrl: './bloco-ordenacao.component.html',
  styleUrls: ['./bloco-ordenacao.component.scss']
})
export class BlocoOrdenacaoComponent implements OnInit {
  orderBy: { order: string, order_by: PossibleOrderings }[] = [
    { order: 'Peso político', order_by: 'peso-politico' },
    { order: 'Governismo', order_by: 'governismo' },
    { order: 'Disciplina Partidária', order_by: 'disciplina-partidaria' },
    { order: 'Atividade no Twitter', order_by: 'atuacao-twitter' },
  ];

  currentSelected?: SelectedOrder;

  constructor(
    private filtroLateralService: FiltroLateralService
  ) {}

  ngOnInit(): void {
    this.filtroLateralService.selectedOrder
      .subscribe(selectedOrder => {
        this.currentSelected = selectedOrder;
      });
  }

  setOrder(ordering: PossibleOrderings, orderType: OrderType) {
    this.filtroLateralService.selectedOrder.next({ ordering, orderType });
  }

  checkSelectedOrder(ordering: PossibleOrderings, orderType: OrderType) {
    if (this.currentSelected === undefined) {
      return false;
    }

    return this.currentSelected.ordering === ordering && this.currentSelected.orderType === orderType;
  }
}
