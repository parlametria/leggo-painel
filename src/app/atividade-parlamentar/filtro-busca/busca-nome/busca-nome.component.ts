import { Component } from '@angular/core';

import { ParlamentaresService } from '../../../shared/services/parlamentares.service';

@Component({
  selector: 'app-busca-nome',
  templateUrl: './busca-nome.component.html',
  styleUrls: ['./busca-nome.component.scss']
})
export class BuscaNomeComponent   {
  searchText: string;

  constructor(
    private parlamentaresService: ParlamentaresService
  ) {}

  nomeChanged(searchText: string) {
    /*
    this.filtro = {
      nome: this.nomePesquisado,
      estado: this.estadoSelecionado,
      partido: this.partidoSelecionado,
      comissao: this.comissaoSelecionada,
      tema: this.temaSelecionado,
      temaSlug: this.temaService.getTemaSlugById(this.temas, this.temaSelecionado),
      orientador: undefined,
      lideranca: this.liderancaSelecionada,
      cargoComissao: this.cargoComissaoSelecionado,
      casa: this.casaSelecionada,
      default: this.isFiltroDefault()
    };
    */

    const filtro = { nome: searchText };
    this.parlamentaresService.search(filtro);
  }
}
