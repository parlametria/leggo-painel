import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AutoriaAgregada } from '../models/autoriaAgregada.model';
import { Autoria, Coautoria, CoautoriaLigacao } from '../models/autoria.model';
import { AutoriaProposicao } from '../models/autoriaProposicao';

@Injectable({
  providedIn: 'root'
})
export class AutoriasService {

  private autoriaUrl = `${environment.baseUrl}/autorias`;
  private atorUrl = `${environment.baseUrl}/ator`;

  constructor(private http: HttpClient) { }

  getAutoriasAgregadas(interesse: string, tema: string, destaque: boolean): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAutoriasAgregadasById(interesse: string, idAutor: number, tema: string, destaque: boolean): Observable<AutoriaAgregada[]> {
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas/${idAutor}/?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAutorias(idAtor: number, interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/autorias/?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAcoes(interesse: string, tema: string, destaque: boolean): Observable<any[]> {
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/acoes/?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAutoriasOriginais(idAtor: number, interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/originais/?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAutoriasAgregadasProjetos(interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/projetos/?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getAutoriasPorProposicao(idLeggo: string): Observable<AutoriaProposicao[]> {
    return this.http.get<AutoriaProposicao[]>(`${this.autoriaUrl}/${idLeggo}/parlamentares`);
  }

  getCoautorias(idLeggo: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/coautorias_node/${idLeggo}`);
  }

  getCoautoriasLigacoes(idLeggo: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.baseUrl}/coautorias_edge/${idLeggo}`);
  }

}
