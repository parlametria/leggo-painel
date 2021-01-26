import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Interesse } from '../models/interesse.model';


@Injectable({
  providedIn: 'root'
})
export class InteresseService {

  private interessesUrl = `${environment.baseUrl}/interesses`;

  constructor(private http: HttpClient) { }

  getInteresses(): Observable<Interesse[]> {
    return this.http.get<Interesse[]>(`${this.interessesUrl}`);
  }

  getInteresse(interesse: string): Observable<Interesse[]> {
    const params = new HttpParams()
      .set('interesse', interesse);
    return this.http.get<Interesse[]>(this.interessesUrl, { params });
  }
}
