import { Component, Input } from '@angular/core';

import { LocalProposicao } from '../../../shared/models/proposicao.model';

@Component({
  selector: 'app-lista-locais-atuais',
  templateUrl: './lista-locais-atuais.component.html',
  styleUrls: ['./lista-locais-atuais.component.scss']
})
export class ListaLocaisAtuaisComponent {

  @Input() locais: any;

  constructor() { }

  getArtigoSiglaLocal(local: LocalProposicao) {
    if (local.tipo_local === 'plenario') {
        return 'no';
    } else {
      return 'na ';
    }
  }

  getSiglaLocal(local: LocalProposicao) {
    if (local.tipo_local === 'plenario') {
        return 'Plenário';
    } else {
      return local.sigla_ultimo_local;
    }
  }

  getNomeLocal(local: LocalProposicao) {
    let l = local.sigla_ultimo_local;
    if (local.tipo_local === 'comissao_permanente') {
      l = local.sigla_ultimo_local;
    } else if (local.tipo_local === 'comissao_especial') {
      l = 'Comissão especial';
    } else if (local.tipo_local === 'plenario') {
      l = 'Plenário';
    }
    const casa = (local.casa_ultimo_local === 'camara') ? 'Câmara' : 'Senado';
    const artigo = (local.casa_ultimo_local === 'camara') ? 'da' : 'do';
    return l + ' ' + artigo + ' ' + casa;
  }

}
