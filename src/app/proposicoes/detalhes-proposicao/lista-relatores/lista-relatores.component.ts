import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista-relatores',
  templateUrl: './lista-relatores.component.html',
  styleUrls: ['./lista-relatores.component.scss']
})
export class ListaRelatoresComponent {

  @Input() etapas = Array;

  constructor() { }

  getRelatorFormatado(relatoria): string {
    const titulo = (relatoria.casa === 'camara') ? 'Dep.' : 'Sen.';
    return titulo + ' ' + relatoria.nome + ' (' + relatoria.partido + '/' + relatoria.uf + ')';
  }

  getRelator(): string {
    const naoEncontrado = 'Relator(a) não encontrado';
    if (this.etapas && this.etapas.length > 0) {
      const ultimaEtapa = this.etapas[this.etapas.length - 1];
      if (ultimaEtapa && ultimaEtapa.relatoria) {
        return this.getRelatorFormatado(ultimaEtapa.relatoria);
      } else {
        return naoEncontrado;
      }
    } else {
      return naoEncontrado;
    }
  }

  getTemRelator(): boolean {
    if (this.etapas && this.etapas.length > 0) {
      const ultimaEtapa = this.etapas[this.etapas.length - 1];
      return (ultimaEtapa && ultimaEtapa.relatoria);
    } else {
      return false;
    }
  }

}
