import { Component, Input } from '@angular/core';

import { LocalProposicao } from '../../../shared/models/proposicao.model';

@Component({
  selector: 'app-lista-locais-atuais',
  templateUrl: './lista-locais-atuais.component.html',
  styleUrls: ['./lista-locais-atuais.component.scss']
})
export class ListaLocaisAtuaisComponent {

  @Input() locais: LocalProposicao[] = [];

  constructor() { }

  getUltimoLocal(locais: LocalProposicao[]) {
      const local = locais[locais.length-1];
      return local || false;
  }
}
