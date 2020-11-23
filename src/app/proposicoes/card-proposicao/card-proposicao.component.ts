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
    this.proposicao.resumo_progresso = this.resumirFases(this.ordenaProgresso(this.proposicao.resumo_progresso));
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
    let ORDER = [
      'Comissão Mista',
      'Câmara dos Deputados',
      'Senado Federal',
      'Câmara dos Deputados - Revisão',
      'Sanção Presidencial/Promulgação'
    ];

    if (resumoProgresso.length && resumoProgresso[0].is_mpv === false) {
      ORDER = [
        'Construção-Comissões',
        'Construção-Plenário',
        'Revisão I-Comissões',
        'Revisão I-Plenário',
        'Revisão II-Comissões',
        'Revisão II-Plenário',
        'Promulgação/Veto-Presidência da República',
        'Sanção/Veto-Presidência da República',
        'Avaliação dos Vetos-Congresso'
      ];

      resumoProgresso = resumoProgresso.map(r => {
        r.fase_global_local = r.fase_global + '-' + r.local;
        return r;
      });

      resumoProgresso.sort((a, b) => {
        return ORDER.indexOf(a.fase_global_local) - ORDER.indexOf(b.fase_global_local);
      });
    } else {
      resumoProgresso.sort((a, b) => {
        return ORDER.indexOf(a.fase_global) - ORDER.indexOf(b.fase_global);
      });
    }

    return resumoProgresso;
  }

  private resumirFases(fases) {
    // Caso alguma fase da Revisão II tenha sido iniciada
    const showRevisao2 = fases.some(fase => fase.fase_global.indexOf('II') !== -1 && fase.data_inicio);
    if (showRevisao2) {
      // Mostra todas as fases
      return fases;
    } else {
      // Não mostra Revisão II
      return fases.filter(fase => fase.fase_global.indexOf('II') === -1);
    }
  }

}
