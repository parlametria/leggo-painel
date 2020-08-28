import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private twitterUrl = `${environment.baseUrl}/twitter`;

  constructor(private http: HttpClient) { }

  getAtividadeTwitter(interesse: string, tema: string): any[] {
    return tema === '' ? [{atividade_twitter: 0.41}] : [{atividade_twitter: 0.2}];
  }

  getAtividadeDetalhadaTwitter(id: string, interesse: string, tema: string): any[] {
    return tema === '' ? [{atividade_twitter: 0.41}] : [{atividade_twitter: 0.2}];
  }
}
