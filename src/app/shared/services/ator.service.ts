import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Ator } from '../models/ator.model';
import { AtorAgregado } from '../models/atorAgregado.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AtorService {

  private atorUrl = `${environment.baseUrl}/ator`;
  private atoresUrl = `${environment.baseUrl}/atores`;

  constructor(private http: HttpClient) { }

  getAtor(interesse: string, idAtor: string): Observable<Ator> {
    return this.http.get<Ator>(`${this.atorUrl}/${idAtor}?interesse=${interesse}`);
  }

  getAtoresAgregados(interesse: string): Observable<AtorAgregado[]> {
    return this.http.get<AtorAgregado[]>(`${this.atoresUrl}/agregados?interesse=${interesse}`);
  }

}
