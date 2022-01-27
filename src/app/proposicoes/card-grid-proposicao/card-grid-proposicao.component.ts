import { Component, Input, OnInit } from '@angular/core';

import {
  ordenaProgressoProposicao,
  resumirFasesProgresso,
} from '../../shared/functions/process_progresso.function';

import { ProposicaoLista, LocalProposicao } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-card-grid-proposicao',
  templateUrl: './card-grid-proposicao.component.html',
  styleUrls: ['./card-grid-proposicao.component.scss'],
})
export class CardGridProposicaoComponent implements OnInit {
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
        } else if (fase.fase_global === 'Sanção/Veto') {
          classe = 'fase-sancao';
        } else {
          classe = 'fase-vetos';
        }
      } else {
        classe = 'fase-nao-realizada';
      }
    }
    return classe;
  }

  getArtigoSiglaLocal(local: LocalProposicao) {
    if (local.tipo_local === 'plenario') {
      return 'Encontra-se no ';
    } else {
      return 'Encontra-se na ';
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
    if (local.tipo_local === 'comissao_permanente') {
      return local.nome_ultimo_local.replace(/Comissão (De|Do)/g, '');
    } else if (local.tipo_local === 'comissao_especial') {
      return 'Comissão especial';
    } else if (local.tipo_local === 'plenario') {
      return 'Plenário';
    } else {
      const casa = (local.casa_ultimo_local === 'camara') ? 'Câmara' : 'Senado';
      return local.sigla_ultimo_local + ' - ' + casa;
    }
  }

  getEhApensada() {
    return this.proposicao.apensadas.length > 0;
  }

  getEhApensadaExterna() {
    return (typeof this.proposicao.apensadas[0] !== 'undefined' && this.proposicao.apensadas[0].id_leggo_principal === null);
  }

  getLinkExterno() {
    if (typeof this.proposicao.apensadas[0] !== 'undefined' && this.proposicao.apensadas[0].id_leggo_principal === null) {
      if (this.proposicao.apensadas[0].casa_principal === 'camara') {
        return 'http://www.camara.gov.br/proposicoesWeb/fichadetramitacao?idProposicao=' + this.proposicao.apensadas[0].id_ext_principal;
      } else {
        return 'https://www25.senado.leg.br/web/atividade/materias/-/materia/' + this.proposicao.apensadas[0].id_ext_principal;
      }
    }
    return '#';
  }

  getLinkInterno() {
    if (typeof this.proposicao.apensadas[0] !== 'undefined' && this.proposicao.apensadas[0].id_leggo_principal !== null) {
      return this.proposicao.apensadas[0].id_leggo_principal;
    }
    return './';
  }

  getNomeApensada() {
    if (typeof this.proposicao.apensadas[0] !== 'undefined' && this.proposicao.apensadas[0].proposicao_principal !== null) {
      if (this.proposicao.apensadas[0].casa_principal === 'camara') {
        return this.proposicao.apensadas[0].proposicao_principal.sigla_camara;
      } else {
        return this.proposicao.apensadas[0].proposicao_principal.sigla_senado;
      }
    }
    return './';
  }

  getProposicaoTitle(proposicao) {
    if (!proposicao) {
      return '';
    }
    const title = proposicao?.etapas[proposicao?.etapas.length - 1]?.sigla;
    if (proposicao?.interesse[0]?.apelido && proposicao?.interesse[0]?.apelido !== 'nan') {
      return title + ' - ' + proposicao?.interesse[0]?.apelido;
    } else {
      return title;
    }
  }

  private ordenaProgresso(resumoProgresso) {
    return ordenaProgressoProposicao(resumoProgresso);
  }

  private resumirFases(fases) {
    return resumirFasesProgresso(fases);
  }
}
