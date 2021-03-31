import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { VotacoesSumarizadas } from '../models/votacoesSumarizadas.model';

@Injectable({
  providedIn: 'root'
})
export class VotacoesSumarizadasService {

  private votacoesSumarizadasUrl = `${environment.baseUrl}/votacoes_sumarizadas`;

  constructor(private http: HttpClient) { }

  getVotacoesSumarizadas(): Observable<VotacoesSumarizadas> {
    return this.http.get<VotacoesSumarizadas>(`${this.votacoesSumarizadasUrl}/`);
  }

  getVotacoesSumarizadasByID(idParlamentar: string): Observable<VotacoesSumarizadas> {
    return this.http.get<VotacoesSumarizadas>(`${this.votacoesSumarizadasUrl}/${idParlamentar}`);
  }
}
