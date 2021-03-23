import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Disciplina } from '../models/proposicoes/disciplina.model';

@Injectable({
  providedIn: 'root'
})

export class DisciplinaService {

  private disciplinaUrl = `${environment.baseUrl}/disciplina`;

  constructor(private http: HttpClient) { }

  getDisciplina(): Observable<Disciplina> {
    return this.http.get<Disciplina>(`${this.disciplinaUrl}/`);
  }

  getDisciplinaByID(idParlamentar: string): Observable<Disciplina> {
    return this.http.get<Disciplina>(`${this.disciplinaUrl}/${idParlamentar}`);
  }
}
