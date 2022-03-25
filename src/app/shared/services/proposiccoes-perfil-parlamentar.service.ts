import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Tema } from 'src/app/shared/models/tema.model';

export interface ProposicaoPerfilParlamentar {
  projetoLei: string; // nome proposicao ?
  idProposicao: number;
  casa: string;
  titulo: string;
  descricao: string;
  temas: Tema[];
  proposicaoVotacoes: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ProposiccoesPerfilParlamentarService {
  private readonly URL = environment.perfilUrl + '/orientacoes';

  constructor(private http: HttpClient) { }

  getProposicoesOrientacao(casa: string): Observable<ProposicaoPerfilParlamentar[]> {
    const params = new HttpParams().set('casa', casa);

    return this.http
      .get<ProposicaoPerfilParlamentar[]>(this.URL + '/proposicoes', { params });
  }
}
