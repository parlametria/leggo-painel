import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { ProposicoesService } from './proposicoes.service';
import { ProposicaoLista } from '../models/proposicao.model';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesListaService {

  private proposicoes = new BehaviorSubject<Array<ProposicaoLista>>([]);
  private proposicoesFiltered = new BehaviorSubject<Array<ProposicaoLista>>([]);

  private orderBy = new BehaviorSubject<string>('');
  readonly ORDER_BY_PADRAO = 'temperatura';

  constructor(
    private proposicoesService: ProposicoesService
  ) {

    this.proposicoes
      .pipe(
        switchMap(parlamentares => {
          return this.orderBy.pipe(map(par => parlamentares));
        }),
        tap(parlamentares => {
          if (this.orderBy.value === 'temperatura') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.ultima_temperatura, b.ultima_temperatura);
            });
          }
        }))
      .subscribe(res => {
        this.proposicoesFiltered.next(res);
      });
  }

  getProposicoes(interesse: string): Observable<ProposicaoLista[]> {
    forkJoin(
      [
        this.proposicoesService.getProposicoes(interesse),
        this.proposicoesService.getUltimaTemperaturaProposicoes(interesse),
        this.proposicoesService.getUltimaPressaoProposicoes(interesse),
        this.proposicoesService.getDataUltimoInsightProposicoes(interesse),
        this.proposicoesService.getProgressoProposicoes(interesse)
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

}
