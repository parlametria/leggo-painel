import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { ProposicaoContagem } from '../models/proposicaoContagem.model';
import { MaximaTemperaturaProposicao } from '../models/proposicoes/maximaTemperaturaProposicao.model';
import { UltimaTemperaturaProposicao } from '../models/proposicoes/ultimaTemperaturaProposicao.model';
import { DataUltimoInsightProposicao } from '../models/proposicoes/dataUltimoInsightProposicao.model';
import { Proposicao, LocalProposicao } from '../models/proposicao.model';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesService {

  private proposicoesUrl = `${environment.baseUrl}/proposicoes`;
  private temperaturaUrl = `${environment.baseUrl}/temperatura`;
  private insightUrl = `${environment.baseUrl}/anotacoes`;
  private locaisUrl = `${environment.baseUrl}/locais`;

  constructor(private http: HttpClient) { }

  getProposicoes(interesse: string): Observable<Proposicao[]> {
    const hoje = moment().format('YYYY-MM-DD');
    return this.http.get<Proposicao[]>(`${this.proposicoesUrl}?interesse=${interesse}&data_referencia=${hoje}`);
  }

  getContagemProposicoes(interesse: string, tema: string, destaque: boolean): Observable<ProposicaoContagem> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<ProposicaoContagem>(`${this.proposicoesUrl}/contagem?${query}`);
  }

  getUltimaTemperaturaProposicoes(interesse: string): Observable<UltimaTemperaturaProposicao[]> {
    return this.http.get<UltimaTemperaturaProposicao[]>(`${this.temperaturaUrl}/ultima?interesse=${interesse}`);
  }

  getMaximaTemperaturaProposicoes(interesse: string): Observable<MaximaTemperaturaProposicao> {
    const dataInicio = moment().subtract(3, 'months').format('YYYY-MM-DD');
    return this.http.get<MaximaTemperaturaProposicao>(`${this.temperaturaUrl}/max?interesse=${interesse}&data_inicio=${dataInicio}`);
  }

  getDataUltimoInsightProposicoes(interesse: string): Observable<DataUltimoInsightProposicao[]> {
    return this.http.get<DataUltimoInsightProposicao[]>(`${this.insightUrl}/ultima?interesse=${interesse}`);
  }

  getListaLocaisProposicoes(interesse: string): Observable<LocalProposicao[]> {
    return this.http.get<LocalProposicao[]>(`${this.locaisUrl}?interesse=${interesse}`);
  }

  private getQuery(interesse: string, tema: string, destaque: boolean) {
    let query = interesse ? `interesse=${interesse}&` : '';
    query = tema ? `${query}tema=${tema}&` : query;
    query = destaque ? `${query}destaque=${destaque}` : query;
    return query;
  }

}
