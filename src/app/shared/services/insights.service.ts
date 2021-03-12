import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Insight } from 'src/app/shared/models/insight.model';

@Injectable({
  providedIn: 'root'
})
export class InsightsService {

  private insightsUrl = `${environment.baseUrl}/anotacoes`;

  constructor(private http: HttpClient) { }

  getInsights(interesse: string): Observable<Insight[]> {
    const params = new HttpParams()
      .set('interesse', interesse);
    return this.http.get<Insight[]>(this.insightsUrl, { params });
  }

}
