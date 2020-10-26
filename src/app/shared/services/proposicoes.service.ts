import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';
import { ProposicaoContagem } from '../models/proposicaoContagem.model';
import { MaximaTemperaturaProposicao } from '../models/proposicoes/maximaTemperaturaProposicao.model';
import { UltimaTemperaturaProposicao } from '../models/proposicoes/ultimaTemperaturaProposicao.model';
import { UltimaPressaoProposicao } from '../models/proposicoes/ultimaPressaoProposicao.model';
import { DataUltimoInsightProposicao } from '../models/proposicoes/dataUltimoInsightProposicao.model';
import { ProgressoProposicao } from '../models/proposicoes/progressoProposicao.model';

@Injectable({
  providedIn: 'root'
})
export class ProposicoesService {

  private proposicoesUrl = `${environment.baseUrl}/proposicoes`;
  private temperaturaUrl = `${environment.baseUrl}/temperatura`;
  private pressaoUrl = `${environment.baseUrl}/pressao`;
  private insightUrl = `${environment.baseUrl}/anotacoes`;
  private progressoUrl = `${environment.baseUrl}/progresso`;

  constructor(private http: HttpClient) { }

  getContagemProposicoes(interesse: string, tema: string): Observable<ProposicaoContagem> {
    return this.http.get<ProposicaoContagem>(`${this.proposicoesUrl}/contagem?interesse=${interesse}&tema=${tema}`);
  }

  getUltimaTemperaturaProposicoes(interesse: string): Observable<UltimaTemperaturaProposicao[]> {
    return this.http.get<UltimaTemperaturaProposicao[]>(`${this.temperaturaUrl}/ultima?interesse=${interesse}`);
  }

  getMaximaTemperaturaProposicoes(interesse: string): Observable<MaximaTemperaturaProposicao> {
    const dataInicio = moment().subtract(3, 'months').format('YYYY-MM-DD');
    return this.http.get<MaximaTemperaturaProposicao>(`${this.temperaturaUrl}/max?interesse=${interesse}&data_inicio=${dataInicio}`);
  }

  getUltimaPressaoProposicoes(interesse: string): Observable<UltimaPressaoProposicao[]> {
    return this.http.get<UltimaPressaoProposicao[]>(`${this.pressaoUrl}/ultima?interesse=${interesse}`);
  }

  getDataUltimoInsightProposicoes(interesse: string): Observable<DataUltimoInsightProposicao[]> {
    return this.http.get<DataUltimoInsightProposicao[]>(`${this.insightUrl}/ultima?interesse=${interesse}`);
  }

  getProgressoProposicoes(interesse: string): Observable<ProgressoProposicao[]> {
    return this.http.get<ProgressoProposicao[]>(`${this.progressoUrl}/?interesse=${interesse}`);
  }

}
