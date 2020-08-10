import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ComissaoPresidencia } from '../models/comissaoPresidencia.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class ComissaoService {
  private comissaoUrl = `${environment.baseUrl}/comissao/presidencia`;

  constructor(private http: HttpClient) { }

  getComissaoPresidencia(interesse: string, tema: string): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}?interesse=${interesse}&tema=${tema}`);
  }

  getComissaoDetalhadaById(interesse: string, idAutor: string, tema: string): Observable<ComissaoPresidencia[]> {
    return this.http.get<ComissaoPresidencia[]>(`${this.comissaoUrl}/${idAutor}?interesse=${interesse}&tema=${tema}`);
  }

}
