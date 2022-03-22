import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { Tema } from 'src/app/shared/models/tema.model';


@Injectable({
  providedIn: 'root'
})
export class TemasPerfilParlamentarService {
  private readonly URL = environment.perfilUrl + '/temas';

  constructor(private http: HttpClient) { }

  getTemas(): Observable<Tema[]> {
    return this.http.get<Tema[]>(this.URL);
  }
}
