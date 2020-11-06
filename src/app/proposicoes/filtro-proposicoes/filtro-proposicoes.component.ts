import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filtro-proposicoes',
  templateUrl: './filtro-proposicoes.component.html',
  styleUrls: ['./filtro-proposicoes.component.scss']
})

export class FiltroProposicoesComponent implements OnInit {

  @Output() filterChange = new EventEmitter<any>();
  proposicaoPesquisada = '';
  filtro: any;

  constructor() { }

  ngOnInit(): void {
  }

  aplicarFiltro() {
    this.filtro = {
      nome: this.proposicaoPesquisada
    };
    this.filterChange.emit(this.filtro);
  }


}
