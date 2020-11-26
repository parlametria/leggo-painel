import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AtorTwitter } from '../models/atorTwitter.model';
<<<<<<< HEAD
import { ProposicaoComMaisTweets } from '../models/proposicaoComMaisTweets.model';
=======
import { Tweet } from '../models/tweet.model';
import { InfoTwitter } from '../models/infoTwitter.model';
>>>>>>> origin/sprint-40

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private twitterUrl = `${environment.twitterAPIUrl}/api`;

  constructor(private http: HttpClient) { }

  getAtividadeTwitter(interesse: string, tema: string): Observable<any[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', '2000-01-01')
      .set('data_final', '2020-12-31');
    return this.http.get<any[]>(`${this.twitterUrl}/tweets/parlamentares`, { params });
  }

  getAtividadeDetalhadaTwitter(id: string, interesse: string, tema: string): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', '2000-01-01')
      .set('data_final', '2020-12-31');
    return this.http.get<any>(`${this.twitterUrl}/tweets/parlamentares/${id}`, { params });
  }

  getMediaTweets(): Observable<any> {
    const params = new HttpParams()
      .set('data_inicial', '2000-01-01')
      .set('data_final', '2020-12-31');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/media`, { params });
  }

  getEngajamento(): Observable<any> {
    const params = new HttpParams()
      .set('data_inicial', '2000-01-01')
      .set('data_final', '2020-12-31');
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/engajamento`, { params });
  }

  getProposicoesComMaisTweets(
      interesse: string, tema: string, dataInicial: string, dataFinal: string, id: string, qtd: string
    ): Observable<ProposicaoComMaisTweets[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('dataInicial', dataInicial)
      .set('dataFinal', dataFinal)
      .set('id', id)
      .set('qtd', qtd);
    return this.http.get<any>(`${this.twitterUrl}/tweets/parlamentares/${id}`, { params });
  }

  getUsernameTwitter(id: string): Observable<AtorTwitter> {
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/username/${id}`);
  }

  getTweetsParlamentar(id: string, interesse: string, tema: string, limit: number): Observable<Tweet[]> {
    let params = new HttpParams()
    .set('interesse', interesse)
    .set('data_inicial', '2000-05-01')
    .set('data_final', '2020-12-31');

    if (tema !== '' && tema !== undefined) {
      params = params.set('tema', tema);
    }

    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }

    return this.http.get<Tweet[]>(`${this.twitterUrl}/tweets/${id}/texto`, { params });
  }

  getInfoTwitter(): Observable<InfoTwitter> {
    return this.http.get<InfoTwitter>(`${this.twitterUrl}/tweets/info`);
  }
}