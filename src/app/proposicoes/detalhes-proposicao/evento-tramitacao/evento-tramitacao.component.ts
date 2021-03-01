import { Component, Input } from '@angular/core';

import { Evento } from 'src/app/shared/models/evento.model';

@Component({
  selector: 'app-evento-tramitacao',
  templateUrl: './evento-tramitacao.component.html',
  styleUrls: ['./evento-tramitacao.component.scss']
})
export class EventoTramitacaoComponent {

  @Input() evento: Evento;

  showMais = false;

  constructor() { }

  toogleShowMais() {
    this.showMais = !this.showMais;
  }

  getResumo(): string {
    if (this.isEvento()) {
      return this.evento.titulo_evento;
    } else if (typeof this.evento.texto_tramitacao !== 'undefined') {
      if (this.evento.texto_tramitacao.length > 50) {
        return this.evento.texto_tramitacao.substring(0, 50);
      } else {
        return this.evento.texto_tramitacao;
      }
    }
    return '';
  }

  getTexto(): string {
    if (this.isEvento()) {
      return this.evento.titulo_evento;
    } else if (typeof this.evento.texto_tramitacao !== 'undefined') {
      return this.evento.texto_tramitacao;
    }
    return '';
  }

  temMaisTexto(): boolean {
    if (this.isEvento()) {
      return false;
    } else if (typeof this.evento.texto_tramitacao !== 'undefined') {
      return (this.evento.texto_tramitacao.length > 50);
    }
    return false;
  }

  isEvento() {
    return (typeof this.evento.evento !== 'undefined' && this.evento.evento !== 'nan');
  }

}
