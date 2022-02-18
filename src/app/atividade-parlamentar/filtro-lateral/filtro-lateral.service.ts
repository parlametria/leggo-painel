import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';


import { Partido } from '../../shared/models/partido.model';

export type PossibleOrderings
  = 'peso-politico'
  | 'governismo'
  | 'disciplina-partidaria'
  | 'atuacao-twitter';

export type OrderType =  'menor' | 'maior';

export type SelectedOrder = {
  ordering: PossibleOrderings,
  orderType: OrderType
};

@Injectable()
export class FiltroLateralService {
  selectedOrder = new BehaviorSubject<SelectedOrder|undefined>(undefined);
  selectedPartido = new BehaviorSubject<Partido|undefined>(undefined);

  resetValuesToDefault() {
    this.selectedOrder.next(undefined);
    this.selectedPartido.next(undefined);
  }
}
