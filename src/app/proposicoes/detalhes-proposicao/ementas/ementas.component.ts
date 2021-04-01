import { Component, Input, OnInit } from '@angular/core';

import { Proposicao } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-ementas',
  templateUrl: './ementas.component.html',
  styleUrls: ['./ementas.component.scss']
})
export class EmentasComponent implements OnInit {

  @Input() proposicao: Proposicao;

  readonly LIMITE_RESUMO = 220;
  showMais = false;

  constructor() { }

  ngOnInit(): void {
  }

  toogleShowMais() {
    this.showMais = !this.showMais;
  }

  getTitulo(): string {
    if (this.proposicao && this.proposicao.etapas.length > 0) {
      const primeiraEtapa = this.proposicao.etapas[0].ementa;
      const ultimaEtapa = this.proposicao.etapas[this.proposicao.etapas.length - 1].ementa;
      if (primeiraEtapa.trim() !== ultimaEtapa.trim()) {
        return 'Ementas';
      }
    }
    return 'Ementa';
  }

  getResumo(texto: string) {
    if (texto !== undefined && texto !== null) {
      if (texto.length > this.LIMITE_RESUMO) {
        return texto.substring(0, this.LIMITE_RESUMO) + '...';
      }
    }
    return texto;
  }

  getTemEmentaResumida(texto: string): boolean {
    if (texto !== undefined && texto !== null) {
      return texto.length > this.LIMITE_RESUMO;
    }
  }

  getTemEmentasIguais(): boolean {
    if (this.proposicao && this.proposicao.etapas.length > 1) {
      const primeiraEtapa = this.proposicao.etapas[0].ementa;
      const ultimaEtapa = this.proposicao.etapas[this.proposicao.etapas.length - 1].ementa;
      return primeiraEtapa.trim() === ultimaEtapa.trim();
    }
    return false;
  }

}
