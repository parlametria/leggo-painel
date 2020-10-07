import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Interesse } from '../models/interesse.model';


@Injectable({
  providedIn: 'root'
})
export class InteresseService {

  private interessesUrl = `${environment.baseUrl}/interesses`;

  constructor(private http: HttpClient) { }

  getInteresse(interesse: string): Observable<Interesse[]> {
    return this.http.get<Interesse[]>(`${this.interessesUrl}?interesse=${interesse}`);
  }
}
