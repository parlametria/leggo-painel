import { Component, Input, OnInit } from '@angular/core';

import { ProposicaoLista } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-card-proposicao',
  templateUrl: './card-proposicao.component.html',
  styleUrls: ['./card-proposicao.component.scss']
})
export class CardProposicaoComponent implements OnInit {

  @Input() id: number;
  @Input() proposicao: ProposicaoLista;
  @Input() maxTemperatura: number;

  constructor() { }

  ngOnInit(): void {
  }

  temasResumido(temas) {
    if (temas && temas.length > 1) {
      return temas[0] + ' e +' + (temas.length - 1);
    }
    return temas;
  }

  getClassRegimeTramitacao(regime: string) {
    const classes = ['badge'];
    switch (regime) {
      case 'Urgência':
        classes.push('badge-danger');
        break;
      case 'Prioridade':
        classes.push('badge-orange');
        break;
      default:
        classes.push('badge-gray');
        break;
    }
    return classes;
  }

}
