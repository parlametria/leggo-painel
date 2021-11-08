import { Component, OnInit, Input } from '@angular/core';

import { Proposicao } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-situacao-proposicao',
  templateUrl: './situacao-proposicao.component.html',
  styleUrls: ['./situacao-proposicao.component.scss'],
})
export class SituacaoProposicaoComponent implements OnInit {
  @Input() proposicao: Proposicao;

  constructor() {}

  ngOnInit(): void {}

  getNomeCasa(casa: string) {
    switch (casa) {
      case 'camara':
        return 'Câmara';
      case 'senado':
        return 'Senado';
      default:
        return 'Câmara';
    }
  }
}
