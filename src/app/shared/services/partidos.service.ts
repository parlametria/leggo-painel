import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import {
  map
} from 'rxjs/operators';

type ApiPartido = {
  id: number,
  sigla: string,
  nome: string,
  uri: string
};

type ApiLink = {
  rel: string,
  href: string,
};

type ApiResponse = {
  dados: ApiPartido[],
  links: ApiLink[]
};

import { Partido } from '../models/partido.model';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {
  private readonly baseUrl = 'https://dadosabertos.camara.leg.br/api/v2/partidos';
  private readonly ordem = 'ASC';
  private readonly ordenarPor = 'sigla';
  private readonly itensPorPagina = 15;

  private partidos = new BehaviorSubject<Partido[]>([]);

  constructor(private http: HttpClient) { }

  getPartidos(): Observable<Partido[]> {
    if (this.partidos.value.length > 0) {
      return this.partidos.asObservable();
    }

    const pages = [
      this.getPageUrl(1),
      this.getPageUrl(2),
      this.getPageUrl(3),
      this.getPageUrl(4),
    ];

    const httpCalls = pages.map(page => this.http.get<ApiResponse>(page));

    const apiPartidos$ = forkJoin(httpCalls).pipe(map(results => {
      const partidosArray: Partido[][] = results.map(result => {
        if (result.dados.length === 0) {
          return [] as Partido[];
        }

        return result.dados.map(dado => ({ idPartido: dado.id, sigla: dado.sigla })) as Partido[];
      });

      // transform Partido[][] into Partido[]
      const partidos: Partido[] = partidosArray.reduce((acc, cur) => [...acc, ...cur], []);

      this.partidos.next(partidos);
      return partidos;
    }));

    return apiPartidos$;
  }

  private getPageUrl(pagina: number = 1) {
    // https://dadosabertos.camara.leg.br/api/v2/partidos?ordem=ASC&ordenarPor=sigla&itens=15&pagina=3
    return `${this.baseUrl}?ordem=${this.ordem}&ordenarPor=${this.ordenarPor}&itens=${this.itensPorPagina}&pagina=${pagina}`;
  }
}
