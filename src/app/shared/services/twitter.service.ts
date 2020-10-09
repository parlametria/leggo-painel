import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

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
      .set('data_inicial', '06-30-2019')
      .set('data_final', '12-30-2019');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/media`, { params });
  }

}
