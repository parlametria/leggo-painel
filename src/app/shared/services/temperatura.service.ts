import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { MaximaTemperaturaProposicao } from '../models/proposicoes/maximaTemperaturaProposicao.model';
import { UltimaTemperaturaProposicao } from '../models/proposicoes/ultimaTemperaturaProposicao.model';
@Injectable({
  providedIn: 'root'
})
export class TemperaturaService {

  private temperaturaUrl = `${environment.baseUrl}/temperatura`;

  constructor(private http: HttpClient) { }

  getMaximaTemperatura(): Observable<MaximaTemperaturaProposicao> {
    return this.http.get<MaximaTemperaturaProposicao>(`${this.temperaturaUrl}/max`);
  }

  getUltimasTemperaturas(): Observable<UltimaTemperaturaProposicao[]> {
    return this.http.get<UltimaTemperaturaProposicao[]>(`${this.temperaturaUrl}/ultima`);
  }
}
