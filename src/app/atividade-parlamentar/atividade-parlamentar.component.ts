import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  p = 1; 

  parlamentares: AtorAgregado[];
  interesse: string;

  constructor(private atorService: AtorService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
      this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
      });
      this.getDadosAtividadeParlamentar();
  }

  getDadosAtividadeParlamentar() {
    forkJoin(
      [
        this.atorService.getAtoresAgregados(this.interesse),
        this.atorService.getAutoriasAgregadas(this.interesse),
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const atores: any = data[0];
        const autoriasAgregadas: any = data[1];

        const parlamentares = atores.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor === p.id_autor),
          ...a
        }));

        // Transforma os pesos para valores entre 0 e 1
        const pesos = parlamentares.map(p => +p.peso_documentos);
        parlamentares.forEach(p =>
          p.atividade_parlamentar = this.normalizarAtividade(p.peso_documentos, Math.min(...pesos), Math.max(...pesos))
        );

        this.parlamentares = parlamentares;
      },
        error => {
          console.log(error);
        }
      );
  }

  pageChange(p:number){
    this.p = p;
  }

  normalizarAtividade(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }

  getParlamentarPosition(
    index: number,
    itensPerPage: number,
    currentPage: number
  ) {
    return (itensPerPage * (currentPage - 1)) + index ;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
