import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { forkJoin, BehaviorSubject, Observable } from 'rxjs';
import { filter, map, reduce } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

export type ParlamentarComissao = {
  idComissaoVoz: string,
  cargo: string,
  infoComissao: {
    sigla: string
  }
};

export type ParlamentarLideranca = {
  cargo: string,
  liderancaPartido: {
    idPartido: number,
    sigla: string
  }
};

export type ParlamentarPerfilParlamentar = {
  idParlamentarVoz: string,
  idParlamentar: string,
  nomeEleitoral: string,
  uf: string,
  emExercicio: boolean,
  casa: string,
  parlamentarComissoes: ParlamentarComissao[],
  parlamentarPartido: {
    idPartido: number,
    sigla: string
  },
  parlamentarLiderancas: ParlamentarLideranca[],
  nomeProcessado: string
};

@Injectable({
  providedIn: 'root'
})
export class ParlamentaresPerfilParlamentarService {
  // http://localhost:5000/api/busca-parlamentar
  private readonly URL = `${environment.perfilUrl}/busca-parlamentar`;
  private parlamentares = new BehaviorSubject<ParlamentarPerfilParlamentar[]>([]);

  constructor(private http: HttpClient) { }

  getParlamentars(): Observable<ParlamentarPerfilParlamentar[]> {
    this.http.get<ParlamentarPerfilParlamentar[]>(this.URL)
      .subscribe(response => {
        this.parlamentares.next(response);
      });

    return this.parlamentares.asObservable();
  }


  getParlamentarsWithLeadership() {
    if (this.parlamentares.value.length === 0) {
      this.getParlamentars();
    }

    const ob = this.parlamentares.pipe(map(parlamentares => {
      return parlamentares.reduce((acc, cur) => {
        if (cur.parlamentarLiderancas.length > 0) {
          acc.push(cur);
        }

        return acc;
      }, [] as ParlamentarPerfilParlamentar[]);
    }));

    return ob;
  }
}
