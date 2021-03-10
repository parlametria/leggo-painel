import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Governismo } from '../models/governismo.model';

@Injectable({
  providedIn: 'root'
})
export class GovernismoService {

  private governismoUrl = `${environment.baseUrl}/governismo`;

  constructor(private http: HttpClient) { }

  getGovernismo(): Observable<Governismo> {
    return this.http.get<Governismo>(`${this.governismoUrl}/`);
  }

  getGovernismoByID(idParlamentar: string): Observable<Governismo> {
    return this.http.get<Governismo>(`${this.governismoUrl}/${idParlamentar}`);
  }
}
