import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AtorTwitter } from '../models/atorTwitter.model';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private twitterUrl = `${environment.twitterAPIUrl}/api/tweets`;
  private twitterParlamentaresUrl = `${environment.twitterAPIUrl}/api/parlamentares`;

  constructor(private http: HttpClient) { }

  getAtividadeTwitter(interesse: string, tema: string): Observable<any[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema);
    return this.http.get<any[]>(`${this.twitterUrl}/parlamentares`, { params });
  }

  getAtividadeDetalhadaTwitter(id: string, interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema);
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/${id}`, { params });
  }

  getAtividadePerfilTwitter(id: string): Observable<AtorTwitter> {
    return this.http.get<any>(`${this.twitterParlamentaresUrl}/${id}`);
  }
}
