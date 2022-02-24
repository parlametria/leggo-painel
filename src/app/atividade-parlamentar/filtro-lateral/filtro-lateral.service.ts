import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';


import { Partido } from '../../shared/models/partido.model';
import { Comissao } from '../../shared/models/comissao.model';
import { ParlamentarComissao } from '../../shared/models/parlamentarComissao.model';
import { Lideranca } from 'src/app/shared/models/lideranca.model';

import {
  FilterFunction,
  FiltroComposite,
  FiltroParlamentaresEstado,
  FiltroParlamentaresPartido,
  FiltroParlamentaresComissao,
  FiltroParlamentaresCargoComissao,
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
  selectedCargo = new BehaviorSubject<Lideranca | undefined>(undefined);

  private parlamentaresComissao: ParlamentarComissao[] = [];

  private filtroComposite = new FiltroComposite();

  resetValuesToDefault() {
    this.selectedOrder.next(undefined);
    this.selectedPartido.next(undefined);
    this.selectedEstado.next(undefined);
    this.selectedComissao.next(undefined);
  }

  setParlamentaresComissao(parlamentares: ParlamentarComissao[]) {
    this.parlamentaresComissao = parlamentares;
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

  filtrarPorComissao() {
    if (this.parlamentaresComissao.length === 0) {
      throw new Error(`parlamentares da comissao nao setados`);
    }

    const filtro = new FiltroParlamentaresComissao(this.parlamentaresComissao);
    this.filtroComposite.addFiltro('comissao', filtro);
  }

  removerFiltrarPorComissao() {
    this.filtroComposite.removeFiltro('comissao');
    this.removerFiltrarPorCargo(); // filtro de cargo depende de comissao
    this.setParlamentaresComissao([]); // reseta parlamentares da comissao
  }

  filtrarPorCargo(lideranca: Lideranca) {
    if (this.parlamentaresComissao.length === 0) {
      throw new Error(`parlamentares da comissao nao setados`);
    }

    const filtro = new FiltroParlamentaresCargoComissao(lideranca, this.parlamentaresComissao);
    this.filtroComposite.addFiltro('cargo', filtro);
  }

  removerFiltrarPorCargo() {
    this.filtroComposite.removeFiltro('cargo');
  }
}
