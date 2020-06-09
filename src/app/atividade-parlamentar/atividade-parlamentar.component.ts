import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from '../shared/services/ator.service';
import { AtorAgregado } from '../shared/models/atorAgregado.model';

@Component({
  selector: 'app-atividade-parlamentar',
  templateUrl: './atividade-parlamentar.component.html',
  styleUrls: ['./atividade-parlamentar.component.scss']
})
export class AtividadeParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  parlamentares: AtorAgregado[];

  constructor(private atorService: AtorService) { }

  ngOnInit(): void {
    this.getDadosAtividadeParlamentar();
  }

  getDadosAtividadeParlamentar() {
    forkJoin(
      [
        this.atorService.getAtoresAgregados(),
        this.atorService.getAutoriasAgregadas(),
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const atores: any = data[0];
        const autoriasAgregadas: any = data[1];

        const parlamentares = atores.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor === p.id_autor),
          ...a
        }));

        this.parlamentares = parlamentares;
      },
        error => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
