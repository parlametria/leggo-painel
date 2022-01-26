import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-lista-autores',
  templateUrl: './lista-autores.component.html',
  styleUrls: ['./lista-autores.component.scss'],
})
export class ListaAutoresComponent {
  @Input() autores = Array;

  showMais = false;

  constructor() {}

  toogleShowMais() {
    this.showMais = !this.showMais;
  }

  getAutorFormatado(autor): string {
    if (autor.is_parlamentar === 1) {
      const titulo = autor.casa === 'camara' ? 'Dep.' : 'Sen.';
      return titulo + ' ' + autor.nome;
    } else {
      return autor.nome;
    }
  }

  getPartidoUf(autor): string {
    if (autor.partido === 'nan') {
      return '';
    }
    return ' ' + autor.partido + '/' + autor.uf;
  }

  getPrimeiroAtor(): string {
    if (this.autores && this.autores.length > 0) {
      return this.getAutorFormatado(this.autores[0].autor);
    }
    return '';
  }

  getMaisAtores(): string {
    if (this.autores && this.autores.length > 0) {
      const separador = ', ';
      let texto = separador;
      for (let i = 1; i < this.autores.length; i++) {
        texto = texto + this.getAutorFormatado(this.autores[i].autor);
        if (i !== this.autores.length - 1) {
          texto = texto + separador;
        }
      }
      return texto;
    }
    return '';
  }

  getQtdMaisAtores(): number {
    if (this.autores && this.autores.length > 1) {
      return this.autores.length - 1;
    }
    return 0;
  }

  getTitulo(): string {
    if (this.autores && this.autores.length === 1) {
      return 'Autor';
    } else {
      return 'Autores';
    }
  }

  getTemMaisAutores(): boolean {
    return this.autores && this.autores.length > 1;
  }
}
