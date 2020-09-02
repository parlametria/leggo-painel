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
    const out = [
      { id_autor_parlametria: 25411, atividade_twitter: 0.7 },
      { id_autor_parlametria: 2825, atividade_twitter: 0.3 },
      { id_autor_parlametria: 1160511, atividade_twitter: 0.5 },
      { id_autor_parlametria: 25352, atividade_twitter: 0.2 }
    ];
    return out;
  }

  getAtividadeDetalhadaTwitter(id: string, interesse: string, tema: string): any[] {
    return tema === '' ? [{atividade_twitter: 0.41}] : [{atividade_twitter: 0.2}];
  }
}
