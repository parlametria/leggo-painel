import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { ProposicoesService } from './proposicoes.service';
import { LocalProposicao, ProposicaoLista } from '../models/proposicao.model';
import { PressaoService } from './pressao.service';
import { ProgressoService } from './progresso.service';

import { setUpperBound } from '../functions/utils';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesListaService {

  private proposicoes = new BehaviorSubject<Array<ProposicaoLista>>([]);
  private proposicoesFiltered = new BehaviorSubject<Array<ProposicaoLista>>([]);
  private totalProposicoes = new BehaviorSubject<number>(0);
  private interesse: string;

  private orderBy = new BehaviorSubject<string>('');
  readonly ORDER_BY_PADRAO = 'maior-temperatura';

  private tema = new BehaviorSubject<string>('');
  readonly TEMA_PADRAO = 'todos';

  readonly STATUS_PADRAO = 'tramitando';
  readonly TIPO_LOCAL_PADRAO = 'geral';
  readonly APENSADAS_PADRAO = true;

  private filtro = new BehaviorSubject<any>({});

  constructor(
    private proposicoesService: ProposicoesService,
    private progressoService: ProgressoService,
    private pressaoService: PressaoService
  ) {

    this.proposicoes
      .pipe(
        switchMap(proposicoes =>
          this.filtro.pipe(
            debounceTime(400),
            distinctUntilChanged(
              (p: any, q: any) => {
                return this.compareFilter(p, q);
              }
            ),
            map(filters => this.filter(proposicoes, filters))
          )),
        switchMap(proposicoes => {
          return this.orderBy.pipe(map(par => proposicoes));
        }),
        tap(proposicoes => {
          if (this.orderBy.value === 'maior-temperatura') {
            proposicoes.sort((a, b) => {
              return this.orderByDesc(a.ultima_temperatura, b.ultima_temperatura);
            });
          }
          if (this.orderBy.value === 'menor-temperatura') {
            proposicoes.sort((b, a) => {
              return this.orderByDesc(a.ultima_temperatura, b.ultima_temperatura);
            });
          }
          if (this.orderBy.value === 'maior-pressao') {
            proposicoes.sort((a, b) => {
              return this.orderByDesc(a.ultima_pressao, b.ultima_pressao);
            });
          }
          if (this.orderBy.value === 'menor-pressao') {
            proposicoes.sort((b, a) => {
              return this.orderByDesc(a.ultima_pressao, b.ultima_pressao);
            });
          }
        })
      )
      .subscribe(res => {
        if (this.proposicoes.value.length !== 0) {
          if (this.interesse === this.proposicoes.value[0].interesse[0].interesse) {
            this.proposicoesFiltered.next(res);
          }
        }
      });
  }

  getProposicoes(interesse: string): Observable<ProposicaoLista[]> {
    this.interesse = interesse;

    forkJoin(
      [
        this.proposicoesService.getProposicoes(interesse),
        this.proposicoesService.getUltimaTemperaturaProposicoes(interesse),
        this.proposicoesService.getMaximaTemperaturaProposicoes(interesse),
        this.pressaoService.getUltimaPressaoProposicoes(interesse),
        this.proposicoesService.getDataUltimoInsightProposicoes(interesse),
        this.progressoService.getProgressoProposicoes(interesse),
      ]
    )
      .subscribe(data => {
        const proposicoes: any = data[0];
        const ultimaTemperatura: any = data[1];
        const maxTemperaturaInteresse: any = data[2];
        const ultimaPressao: any = data[3];
        const dataUltimoInsight: any = data[4];
        const progresso: any = data[5];

        const progressos = this.processaProgresso(progresso);

        const proposicoesLista = proposicoes.map(a => ({
          ultima_temperatura: setUpperBound(this.getProperty(ultimaTemperatura.find(p => a.id_leggo === p.id_leggo),
            'ultima_temperatura')),
          temp_quinze_dias: setUpperBound(this.getProperty(ultimaTemperatura.find(p => a.id_leggo === p.id_leggo),
            'temp_quinze_dias')),
          ultima_pressao: setUpperBound(this.getProperty(ultimaPressao.find(p => a.id_leggo === p.id_leggo),
            'ultima_pressao')),
          pressao_oito_dias: setUpperBound(this.getProperty(ultimaPressao.find(p => a.id_leggo === p.id_leggo),
            'pressao_oito_dias')),
          anotacao_data_ultima_modificacao: this.getProperty(dataUltimoInsight.find(p => a.id_leggo === p.id_leggo),
            'anotacao_data_ultima_modificacao'),
          resumo_progresso: progressos[a.id_leggo],
          max_temperatura_interesse: setUpperBound(maxTemperaturaInteresse.max_temperatura_periodo),
          isDestaque: this.isDestaque(a),
          fase: this.processaFase(progressos[a.id_leggo], this.isAprovadaEmUmaCasa(a)),
          ...a
        }));

        this.proposicoes.next(proposicoesLista);
      },
        error => console.log(error)
      );

    return this.proposicoesFiltered.asObservable();
  }

  getTotalProposicoes(interesse: string): Observable<number> {
    this.interesse = interesse;
    this.proposicoesService.getProposicoes(interesse).subscribe(proposicoes => {
      this.totalProposicoes.next(proposicoes.length);
    });
    return this.totalProposicoes.asObservable();
  }

  private processaProgresso(progresso: any) {
    const progressoProcessado = progresso.reduce((acc, curr) => {
      const k = curr.id_leggo;
      if (!acc[k]) {
        acc[k] = [];
      }
      acc[k].push(curr);
      return acc;
    }, {});
    return progressoProcessado;
  }

  private getProperty(objeto: any, property: string) {
    if (objeto === undefined) {
      return undefined;
    } else {
      return objeto[property];
    }
  }

  private isAprovadaEmUmaCasa(prop: ProposicaoLista) {
    if (typeof prop.destaques === 'undefined' || prop.destaques.length === 0) {
      return false;
    }

    return prop.destaques[0].criterio_aprovada_em_uma_casa;
  }

  private isDestaque(prop: ProposicaoLista) {
    if (typeof prop.destaques !== 'undefined' && prop.destaques.length !== 0) {
      const destaques = prop.destaques[0];
      return (destaques.criterio_aprovada_em_uma_casa || destaques.criterio_req_urgencia_aprovado);
    }
    return false;
  }

  search(filtro: any) {
    if (filtro.status === undefined || filtro.status === '') {
      filtro.status = this.STATUS_PADRAO;
      filtro.semApensada = this.APENSADAS_PADRAO;
    }
    this.filtro.next(filtro);
  }

  private compareFilter(p: any, q: any) {
    return p.nome === q.nome &&
      p.status === q.status &&
      p.tema === q.tema &&
      p.local === q.local &&
      p.fase === q.fase;
  }

  private filter(proposicoes: ProposicaoLista[], filtro: any) {
    const nome = filtro.nome;
    const status = filtro.status;
    const tema = filtro.tema;
    const local = filtro.local;
    const fase = filtro.fase;
    let semApensada = filtro.semApensada;
    // Condição fixa para exibir apensadas no resultado:
    if (nome) {
      semApensada = false;
    }
    return proposicoes.filter(p => {
      let filtered = true;
      const termos = (p.sigla_camara + p.sigla_senado + p.interesse[0].apelido)
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();

      filtered =
        nome && filtered
          ? termos.includes(nome.normalize('NFD').replace(/[\u0300-\u036f]|\s*$/g, '').toLowerCase())
          : filtered;

      filtered =
        status && filtered
          ? this.checkProposicaoAtiva(p.etapas[p?.etapas.length - 1].status, status)
          : filtered;

      filtered =
        tema && filtered
          ? this.matchTema(p, tema)
          : filtered;

      filtered =
        local && filtered
          ? this.matchLocal(p.locaisProposicao, local)
          : filtered;

      filtered =
        semApensada && filtered
          ? p.apensadas.length < 1
          : filtered;

      filtered = fase && filtered ? this.checkFase(p.fase, fase) : filtered;

      return filtered;
    });
  }

  private orderByDesc(a: number, b: number) {
    if (isNaN(b)) {
      return -1;
    }
    if (isNaN(a)) {
      return 1;
    }
    return b - a;
  }

  setOrderBy(orderBy: string) {
    if (orderBy === undefined || orderBy === '') {
      this.orderBy.next(this.ORDER_BY_PADRAO);
    } else {
      this.orderBy.next(orderBy);
    }
  }

  setTema(tema: string) {
    if (tema === undefined || tema === '') {
      this.tema.next(this.TEMA_PADRAO);
    } else {
      this.tema.next(tema);
    }
  }

  matchTema(p: ProposicaoLista, tema: string) {
    const temasSlugProposicao = p.interesse[0].slug_temas;
    if (tema === 'todos') {
      return true;
    }
    if (tema === 'destaque') {
      return p.isDestaque;
    }
    return ((temasSlugProposicao).indexOf(tema)) !== -1;
  }

  private checkProposicaoAtiva(statusProposicao: string, statusFiltro: string) {
    const check = (statusFiltro === 'tramitando' && statusProposicao === 'Ativa') ||
      (statusFiltro === 'finalizada' && statusProposicao !== 'Ativa') ||
      (statusFiltro === 'todas');

    if (check === undefined) {
      return true;
    }

    return check;
  }

  private matchLocal(localProp: LocalProposicao[], localFiltro: LocalProposicao) {
    if (localFiltro.tipo_local === this.TIPO_LOCAL_PADRAO) {
      return true;
    }
    if (localProp !== undefined && localFiltro !== undefined) {
      const locaisFiltrados = localProp.filter(l => (l.sigla_ultimo_local === localFiltro.sigla_ultimo_local) &&
        l.casa_ultimo_local === localFiltro.casa_ultimo_local);
      return locaisFiltrados.length > 0;
    }
    return false;
  }

  private processaFase(progresso: Array<any>, isAprovadaEmUmaCasa: boolean) {
    const faseTramitacao = ['Iniciadora', 'Revisora', 'Réplica', 'Sanção/Veto'];

    if (isAprovadaEmUmaCasa) {
      return faseTramitacao[1];
    }

    if (!progresso) {
      return '';
    }

    let fase = 0;
    progresso.forEach(pfase => {
      if (pfase.data_inicio && pfase.data_fim || pfase.pulou === true) {
        fase += 1;
      }
    });
    switch (fase) {
      case 0:
      case 1:
      case 2:
        return faseTramitacao[0];
      case 3:
      case 4:
        return faseTramitacao[1];
      case 5:
      case 6:
        return faseTramitacao[2];
      case 7:
      case 8:
        return faseTramitacao[3];
      default:
        return 'Não tramitada';
    }
  }

  private checkFase(faseProposicao: string, fase: Array<string>) {
    const fases = {
      iniciadora: 'Iniciadora',
      revisora: 'Revisora',
      replica: 'Réplica',
      sancao: 'Sanção/Veto'
    };
    if (fase.map(f => fases[f]).includes(faseProposicao) || fase[0] === 'todas' || (faseProposicao === '' && fase[0] === 'nenhuma')) {
      return true;
    }
    return false;
  }

}
