import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';


import { Partido } from '../../shared/models/partido.model';
import { Comissao } from '../../shared/models/comissao.model';
import { ParlamentarComissao } from '../../shared/models/parlamentarComissao.model';

import {
  FilterFunction,
  FiltroComposite,
  FiltroParlamentaresEstado,
  FiltroParlamentaresPartido,
  FiltroParlamentaresComissao,
} from './filtros.composite';

export type PossibleOrderings
  = 'peso-politico'
  | 'governismo'
  | 'disciplina-partidaria'
  | 'atuacao-twitter';

export type OrderType = 'menor' | 'maior';

export type SelectedOrder = {
  ordering: PossibleOrderings,
  orderType: OrderType
};

@Injectable()
export class FiltroLateralService {
  selectedOrder = new BehaviorSubject<SelectedOrder | undefined>(undefined);
  selectedPartido = new BehaviorSubject<Partido | undefined>(undefined);
  selectedEstado = new BehaviorSubject<string | undefined>(undefined);
  selectedComissao = new BehaviorSubject<Comissao | undefined>(undefined);
  // parlamentaresComissao = new BehaviorSubject<ParlamentarComissao[]>([]);

  private filtroComposite = new FiltroComposite();

  resetValuesToDefault() {
    this.selectedOrder.next(undefined);
    this.selectedPartido.next(undefined);
    this.selectedEstado.next(undefined);
    this.selectedComissao.next(undefined);
  }

  getFiltro(): FilterFunction {
    // retornando uma lambda pq o parlamentaresService estava perdendo a referencia
    // do "this" interno do filtro
    return (p: any) => this.filtroComposite.filtrar(p);
  }

  filtrarPorEstado(estado: string) {
    const filtro = new FiltroParlamentaresEstado(estado);
    this.filtroComposite.addFiltro('estado', filtro);
  }

  removerFiltrarPorEstado() {
    this.filtroComposite.removeFiltro('estado');
  }

  filtrarPorPartido(partido: Partido) {
    const filtro = new FiltroParlamentaresPartido(partido.sigla);
    this.filtroComposite.addFiltro('partido', filtro);
  }

  removerFiltrarPorPartido() {
    this.filtroComposite.removeFiltro('partido');
  }

  filtrarPorComissao(parlamentares: ParlamentarComissao[]) {
    const filtro = new FiltroParlamentaresComissao(parlamentares);
    this.filtroComposite.addFiltro('comissao', filtro);
  }

  removerFiltrarPorComissao() {
    this.filtroComposite.removeFiltro('comissao');
  }
}
