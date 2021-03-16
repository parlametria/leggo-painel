import { Component, Input, OnInit } from '@angular/core';

import {
  ordenaProgressoProposicao,
  resumirFasesProgresso,
} from '../../shared/functions/process_progresso.function';

import { ProposicaoLista } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-card-proposicao',
  templateUrl: './card-proposicao.component.html',
  styleUrls: ['./card-proposicao.component.scss'],
})
export class CardProposicaoComponent implements OnInit {
  @Input() id: number;
  @Input() proposicao: ProposicaoLista;

  constructor() {}

  ngOnInit(): void {
    this.proposicao.resumo_progresso = this.resumirFases(
      this.ordenaProgresso(this.proposicao.resumo_progresso)
    );
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
        classes.push('badge-warning');
        break;
      default:
        classes.push('badge-gray');
        break;
    }
    return classes;
  }

  getClassFaseProgresso(fase) {
    let classe = '';
    if (fase.pulou) {
      classe = 'fase-pulou';
    } else {
      if (fase.data_inicio !== null) {
        if (!fase.is_mpv && (fase.local_casa === 'camara' || fase.local_casa === 'senado')) {
          classe = 'fase-' + fase.local_casa;
        } else if (fase.is_mpv) {
          if (fase.fase_global === 'Câmara dos Deputados' || fase.fase_global === 'Câmara dos Deputados - Revisão') {
            classe = 'fase-camara';
          } else if (fase.fase_global === 'Senado Federal') {
            classe = 'fase-senado';
          } else if (fase.fase_global === 'Comissão Mista') {
            classe = 'fase-comissao-mista';
          } else {
            classe = 'fase-sancao';
          }
        } else {
          classe = 'fase-sancao';
        }
      } else {
        classe = 'fase-nao-realizada';
      }
    }
    return classe;
  }

  private ordenaProgresso(resumoProgresso) {
    return ordenaProgressoProposicao(resumoProgresso);
  }

  private resumirFases(fases) {
    return resumirFasesProgresso(fases);
  }
}
