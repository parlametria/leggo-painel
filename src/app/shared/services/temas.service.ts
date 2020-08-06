import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private temasUrl = `${environment.baseUrl}/temas`;

  constructor(private http: HttpClient) { }

  getTemas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.temasUrl}`);
  }
}
