import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { ParlamentarPesoPolitico } from '../models/parlamentarPesoPolitico.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PesoPoliticoService {

  private pesoPoliticoUrl = `${environment.baseUrl}/atores/peso_politico`;

  constructor(private http: HttpClient) { }

  getPesoPolitico(): Observable<ParlamentarPesoPolitico[]> {
    return this.http.get<ParlamentarPesoPolitico[]>(`${this.pesoPoliticoUrl}/`);
  }

  getPesoPoliticoById(idAutor: number): Observable<ParlamentarPesoPolitico[]> {
    return this.http.get<ParlamentarPesoPolitico[]>(`${this.pesoPoliticoUrl}/${idAutor}`);
  }

}
