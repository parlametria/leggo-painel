import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AtorTwitter } from '../models/atorTwitter.model';
import { ProposicaoComMaisTweets } from '../models/proposicaoComMaisTweets.model';
import { Tweet, ParlamentarPerfil, InfoTweets, Embed, Engajamento, InteresseTweet } from '../models/tweet.model';
import { InfoTwitter } from '../models/infoTwitter.model';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private twitterUrl = `${environment.twitterAPIUrl}/api`;
  private parlamentarUrl = `${environment.baseUrl}/parlamentar/`;
  private twitterInfoUrl = `${environment.baseUrl}/tweets/info/`;
  private twitter = `${environment.baseUrl}/tweets/`;
  private engajamentoUrl = `${environment.baseUrl}/engajamento/`;

  constructor(private http: HttpClient) { }

  getTweets(parlamentar: ParlamentarPerfil): Observable<Embed[]> {
    return this.http.get<Embed[]>(`${this.twitter}?parlamentar=${parlamentar.entidade}`);
  }

  getTweetsInteresse(parlamentar: ParlamentarPerfil): Observable<InteresseTweet[]> {
    return this.http.get<InteresseTweet[]>(`${this.twitter}${parlamentar.entidade}/`);
  }

  getTweetsInfo(): Observable<InfoTweets> {
    return this.http.get<InfoTweets>(this.twitterInfoUrl);
  }

  getAtividade(idEntidade: string): Observable<ParlamentarPerfil> {
    if (!idEntidade) {
      return;
    }
    const path = `${this.parlamentarUrl}${idEntidade}/`;
    return this.http.get<ParlamentarPerfil>(path);
  }

  getEngajamentoParlamentar(parlamentar: ParlamentarPerfil): Observable<Engajamento[]> {
    const path = `${this.engajamentoUrl}${parlamentar.entidade}/`;
    return this.http.get<Engajamento[]>(path);
  }


  getAtividadeTwitter(interesse: string, tema: string, dataInicial: string, dataFinal: string, destaque: boolean): Observable<any[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('destaque', String(destaque))
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal)
      .set('destaque', destaque.toString());
    return this.http.get<any[]>(`${this.twitterUrl}/tweets/parlamentares`, { params });
  }

  getAtividadeDetalhadaTwitter(
    id: string, interesse: string, tema: string, dataInicial: string, dataFinal: string, destaque: boolean
  ): Observable<any> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal)
      .set('destaque', destaque.toString());
    return this.http.get<any>(`${this.twitterUrl}/tweets/parlamentares/${id}`, { params });
  }

  getMediaTweets(dataInicial: string, dataFinal: string): Observable<any> {
    const params = new HttpParams()
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal);
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/media`, { params });
  }

  getEngajamento(dataInicial: string, dataFinal: string): Observable<any> {
    const params = new HttpParams()
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal);
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/engajamento`, { params });
  }

  getProposicoesComMaisTweets(
    interesse: string, tema: string, dataInicial: string, dataFinal: string, id: string, qtd: string, destaque: boolean
  ): Observable<ProposicaoComMaisTweets[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('tema', tema)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal)
      .set('qtd', qtd)
      .set('destaque', destaque.toString());
    return this.http.get<any>(`${this.twitterUrl}/proposicoes/parlamentar/${id}`, { params });
  }

  getProposicoesComMaisTweetsPeriodo(interesse: string, dataInicial: string, dataFinal: string): Observable<ProposicaoComMaisTweets[]> {
    const params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal);
    return this.http.get<any>(`${this.twitterUrl}/proposicoes/mais-comentadas`, { params });
  }

  getUsernameTwitter(id: string): Observable<AtorTwitter> {
    return this.http.get<any>(`${this.twitterUrl}/parlamentares/username/${id}`);
  }

  getTweetsParlamentar(
    id: string, interesse: string, tema: string, dataInicial: string, dataFinal: string, limit: number, destaque: boolean
  ): Observable<Tweet[]> {
    let params = new HttpParams()
      .set('interesse', interesse)
      .set('data_inicial', dataInicial)
      .set('data_final', dataFinal)
      .set('destaque', destaque.toString());

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

  getTweetRawInfo(): Observable<InfoTwitter> {
    return this.http.get<InfoTwitter>(`${this.twitterUrl}/tweets/info/raw`);
  }
}
