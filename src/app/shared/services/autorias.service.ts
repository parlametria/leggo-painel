import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AutoriaAgregada } from '../models/autoriaAgregada.model';
import { Autoria } from '../models/autoria.model';

@Injectable({
  providedIn: 'root'
})
export class AutoriasService {

  private autoriaUrl = `${environment.baseUrl}/autorias`;
  private atorUrl = `${environment.baseUrl}/ator`;

  constructor(private http: HttpClient) { }

  getAutoriasAgregadas(interesse: string, tema: string): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas?interesse=${interesse}&tema=${tema}`);
  }

  getAutoriasAgregadasById(interesse: string, idAutor: number, tema: string): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas/${idAutor}/?interesse=${interesse}&tema=${tema}`);
  }

  getAutorias(idAtor: number, interesse: string, tema: string): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/autorias/?interesse=${interesse}&tema=${tema}`);
  }

  getAcoes(interesse: string, tema: string): Observable<any[]> {
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/acoes/?interesse=${interesse}&tema=${tema}`);
  }

  getAutoriasOriginais(idAtor: number, interesse: string, tema: string): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/originais/?interesse=${interesse}&tema=${tema}`);
  }

  getAutoriasAgregadasProjetos(interesse: string, tema: string): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/projetos/?interesse=${interesse}&tema=${tema}`);
  }
}
