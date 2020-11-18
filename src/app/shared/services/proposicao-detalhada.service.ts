import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Proposicao } from '../models/proposicao.model';
@Injectable({
  providedIn: 'root'
})
export class ProposicaoDetalhadaService {

  private proposicoesUrl = `${environment.baseUrl}/proposicoes`;

  constructor(private http: HttpClient) { }

  getProposicaoDetalhada(idLeggo: string, interesse: string): Observable<Proposicao> {
    const params = new HttpParams()
    .set('interesse', interesse);
    return this.http.get<Proposicao>(`${this.proposicoesUrl}/${idLeggo}`, { params });
  }
}
