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
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas?${query}`);
  }

  getAutoriasAgregadasById(interesse: string, idAutor: number, tema: string, destaque: boolean): Observable<AutoriaAgregada[]> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<AutoriaAgregada[]>(`${this.autoriaUrl}/agregadas/${idAutor}/?${query}`);
  }

  getAutorias(idAtor: number, interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/autorias/?${query}`);
  }

  getAcoes(interesse: string, tema: string, destaque: boolean): Observable<any[]> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/acoes/?${query}`);
  }

  getAutoriasOriginais(idAtor: number, interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<Autoria[]>(`${this.atorUrl}/${idAtor}/originais/?${query}`);
  }

  getAutoriasAgregadasProjetos(interesse: string, tema: string, destaque: boolean): Observable<Autoria[]> {
    const query = this.getQuery(interesse, tema, destaque);
    return this.http.get<Autoria[]>(`${this.autoriaUrl}/projetos/?${query}`);
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

  private getQuery(interesse: string, tema: string, destaque: boolean) {
    let query = interesse ? `interesse=${interesse}&` : '';
    query = tema ? `${query}tema=${tema}&` : query;
    query = destaque ? `${query}destaque=${destaque}` : query;
    return query;
  }
}
