import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { ProposicoesService } from './proposicoes.service';
import { ProposicaoLista } from '../models/proposicao.model';
import { PressaoService } from './pressao.service';
import { ProgressoService } from './progresso.service';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesListaService {

  private proposicoes = new BehaviorSubject<Array<ProposicaoLista>>([]);
  private proposicoesFiltered = new BehaviorSubject<Array<ProposicaoLista>>([]);
  private proposicoesDestaque = new BehaviorSubject<Array<ProposicaoLista>>([]);

  private orderBy = new BehaviorSubject<string>('');
  readonly ORDER_BY_PADRAO = 'maior-temperatura';

  private tema = new BehaviorSubject<string>('');
  readonly TEMA_PADRAO = 'todos';

  readonly STATUS_PADRAO = 'tramitando';

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
          this.proposicoesFiltered.next(res);
        }
      });
  }

  getProposicoes(interesse: string): Observable<ProposicaoLista[]> {
    forkJoin(
      [
        this.proposicoesService.getProposicoes(interesse),
        this.proposicoesService.getUltimaTemperaturaProposicoes(interesse),
        this.pressaoService.getUltimaPressaoProposicoes(interesse),
        this.proposicoesService.getDataUltimoInsightProposicoes(interesse),
        this.progressoService.getProgressoProposicoes(interesse)
      ]
    )
      .subscribe(data => {
        const proposicoes: any = data[0];
        const ultimaTemperatura: any = data[1];
        const ultimaPressao: any = data[2];
        const dataUltimoInsight: any = data[3];
        const progresso: any = data[4];

        const progressos = this.processaProgresso(progresso);

        const proposicoesLista = proposicoes.map(a => ({
          ultima_temperatura: this.getProperty(ultimaTemperatura.find(p => a.id_leggo === p.id_leggo),
            'ultima_temperatura'),
          ultima_pressao: this.getProperty(ultimaPressao.find(p => a.id_leggo === p.id_leggo),
            'ultima_pressao'),
          anotacao_data_ultima_modificacao: this.getProperty(dataUltimoInsight.find(p => a.id_leggo === p.id_leggo),
            'anotacao_data_ultima_modificacao'),
          resumo_progresso: progressos[a.id_leggo],
          ...a
        }));

        this.proposicoes.next(proposicoesLista);
      },
        error => console.log(error)
      );

    return this.proposicoesFiltered.asObservable();
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

  private isDestaque(prop: ProposicaoLista) {
    return (typeof prop.destaques !== 'undefined' && prop.destaques.length !== 0);
  }

  search(filtro: any) {
    if (filtro.status === undefined || filtro.status === '') {
      filtro.status = this.STATUS_PADRAO;
    }
    this.filtro.next(filtro);
  }

  private compareFilter(p: any, q: any) {
    return p.nome === q.nome &&
      p.status === q.status &&
      p.tema === q.tema;
  }

  private filter(proposicoes: ProposicaoLista[], filtro: any) {
    const nome = filtro.nome;
    const status = filtro.status;
    const tema = filtro.tema;

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
    if ( tema === 'todos') {
      return true;
    }
    if (tema === 'destaque') {
      return this.isDestaque(p);
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

}
