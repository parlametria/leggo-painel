import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { ProgressoProposicao } from '../models/proposicoes/progressoProposicao.model';

@Injectable({
  providedIn: 'root'
})
export class ProgressoService {

  private progressoUrl = `${environment.baseUrl}/progresso`;

  constructor(private http: HttpClient) { }

  getProgressoProposicoes(interesse: string): Observable<ProgressoProposicao[]> {
    return this.http.get<ProgressoProposicao[]>(`${this.progressoUrl}/?interesse=${interesse}`);
  }

  getProgressoProposicaoById(idLeggo: string): Observable<ProgressoProposicao[]> {
    return this.http.get<ProgressoProposicao[]>(`${this.progressoUrl}/${idLeggo}`);
  }

}
