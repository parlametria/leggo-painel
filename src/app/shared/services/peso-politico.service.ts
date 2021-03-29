import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { ParlamentarPesoPolitico, PesoPolitico } from '../models/parlamentarPesoPolitico.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PesoPoliticoService {

  private pesoPoliticoUrl = `${environment.baseUrl}/atores/peso_politico`;
  private pesoPoliticoPerfilUrl = `${environment.perfilUrl}/perfil`;

  constructor(private http: HttpClient) { }

  getPesoPoliticoLeggo(): Observable<ParlamentarPesoPolitico[]> {
    return this.http.get<ParlamentarPesoPolitico[]>(`${this.pesoPoliticoUrl}`);
  }

  getPesoPoliticoByIdLeggo(idAutor: string): Observable<ParlamentarPesoPolitico[]> {
    return this.http.get<ParlamentarPesoPolitico[]>(`${this.pesoPoliticoUrl}/${idAutor}`);
  }

  getPesoPolitico(): Observable<PesoPolitico[]> {
    return this.http.get<PesoPolitico[]>(`${this.pesoPoliticoPerfilUrl}/lista`);
  }

  getPesoPoliticoById(idParlamentar: string): Observable<PesoPolitico[]> {
    return this.http.get<PesoPolitico[]>(`${this.pesoPoliticoPerfilUrl}/peso/${idParlamentar}`);
  }

  normalizarPesoPolitico(metrica: number, max: number): number {
    if (max !== 0) {
      return (metrica / max);
    }
    return 0;
  }

}
