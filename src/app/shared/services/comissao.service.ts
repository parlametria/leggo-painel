import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ComissaoPresidencia, ComissoesCargo } from '../models/comissaoPresidencia.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ComissaoService {
  private comissaoUrl = `${environment.baseUrl}/comissao/presidencia`;
  private comissaoUrlPerfil = `${environment.perfilUrl}/comissoes`;

  constructor(private http: HttpClient) { }

  getComissaoPresidenciaLeggo(interesse: string, tema: string, destaque: boolean): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getComissaoDetalhadaByIdLeggo(interesse: string, idAutor: string, tema: string, destaque: boolean): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}/${idAutor}?interesse=${interesse}&tema=${tema}&destaque=${destaque}`);
  }

  getComissaoPresidencia(): Observable<ComissoesCargo[]> {
    return this.http.get<ComissoesCargo[]>(`${this.comissaoUrlPerfil}/presidentes`);
  }

  getComissaoDetalhadaById(idParlamentar: string): Observable<ComissoesCargo[]> {
    return this.http.get<ComissoesCargo[]>(`${this.comissaoUrlPerfil}/presidentes/${idParlamentar}`);
  }

}
