import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AtorTwitter } from '../models/atorTwitter.model';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private twitterUrl = `${environment.twitterAPIUrl}/api`;

  constructor(private http: HttpClient) { }

  getAtividadeTwitter(interesse: string, tema: string): Observable<any[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema);
    return this.http.get<any[]>(`${this.twitterUrl}/tweets/parlamentares`, { params });
  }

  getAtividadeDetalhadaTwitter(id: string, interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema);
    return this.http.get<any>(`${this.twitterUrl}/tweets/parlamentares/${id}`, { params });
  }

  getMediaTweets(interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', '01-01-2000')
      .set('data_final', '10-10-2020');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/media`, { params });
  }

  getPercentualTweets(interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', '01-01-2000')
      .set('data_final', '10-10-2020');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/percentual_atividade_agenda`, { params });
  }

  getEngajamento(interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', '01-01-2000')
      .set('data_final', '10-10-2020');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/engajamento`, { params });
  }

  getUsernameTwitter(id: string): Observable<AtorTwitter> {
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/username/${id}`);
  }
}
