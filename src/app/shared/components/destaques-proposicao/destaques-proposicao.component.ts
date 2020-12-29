import { Component, OnInit, Input } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-destaques-proposicao',
  templateUrl: './destaques-proposicao.component.html',
  styleUrls: ['./destaques-proposicao.component.scss']
})
export class DestaquesProposicaoComponent implements OnInit {

  @Input() destaques;

  constructor() { }

  ngOnInit(): void {
  }

  getCriterioAprovadoCasa(casa: string): string {
    let str = 'Aprovado ';
    if (casa === 'camara') {
      str += 'na Câmara';
    } else if (casa === 'senado') {
      str += 'no Senado';
    }
    return str;
  }

  getCriterioAvancouComissao(comissoesCamara: string, comissoesSenado: string): string {
    let str = '';
    if (comissoesCamara !== null) {
      str += 'Avançou na ' + comissoesCamara + ' da Câmara';
      if (comissoesSenado !== null) {
        str += ' e na ';
        const comissoes = comissoesSenado.split(';');
        comissoes.forEach(c => str += c + ', ');
        str = str.slice(0, -2);
        str += ' no Senado';
      }
    } else if (comissoesSenado !== null) {
      str += 'Avançou na ';
      const comissoes = comissoesSenado.split(';');
      comissoes.forEach(c => str += c + ', ');
      str = str.slice(0, -2);
      str += ' do Senado';
    }
    return str;
  }

  getCriterioRequerimentoUrgencia(
    tipoRequerimento: string, casaRequerimento: string, dataRequerimento: Date) {
    let str = tipoRequerimento;
    if (casaRequerimento === 'camara') {
      str += ' na Câmara';
    } else if (casaRequerimento === 'senado') {
      str += ' no Senado';
    }
    str += ' em ' + moment(dataRequerimento).format('DD/MM/YYYY');
    return str;
  }

}
