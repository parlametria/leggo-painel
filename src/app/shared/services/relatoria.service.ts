import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { AtorRelator, Relatorias } from '../models/atorRelator.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RelatoriaService {

  private relatoriaUrl = `${environment.baseUrl}/atores/relatorias`;

  constructor(private http: HttpClient) { }

  getAtoresRelatores(interesse: string, tema: string): Observable<AtorRelator[]> {
    return this.http.get<AtorRelator[]>(`${this.relatoriaUrl}?interesse=${interesse}&tema=${tema}`);
  }

  getRelatoriasDetalhadaById(interesse: string, idAutor: string): Observable<Relatorias[]> {
    return this.http.get<Relatorias[]>(`${this.relatoriaUrl}/detalhada/${idAutor}/?interesse=${interesse}`);
  }
}
