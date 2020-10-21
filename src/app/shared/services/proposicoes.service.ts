import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Proposicao } from '../models/proposicao.model';
import { ProposicaoContagem } from '../models/proposicaoContagem.model';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesService {

  private proposicoesUrl = `${environment.baseUrl}/proposicoes`;

  constructor(private http: HttpClient) { }

  getProposicoes(): Observable<Proposicao[]> {
    return this.http.get<Proposicao[]>(`${this.proposicoesUrl}`);
  }

  getProposicoesById(interesse: string, id: number): Observable<Proposicao> {
    return this.http.get<Proposicao>(`${this.proposicoesUrl}/${id}?interesse=${interesse}`);
  }

  getContagemProposicoes(interesse: string, tema: string): Observable<ProposicaoContagem> {
    return this.http.get<ProposicaoContagem>(`${this.proposicoesUrl}/contagem?interesse=${interesse}&tema=${tema}`);
  }

}
