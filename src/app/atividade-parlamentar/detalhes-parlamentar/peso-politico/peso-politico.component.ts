import { Component, OnInit } from '@angular/core';

import { AtorService } from '../../../shared/services/ator.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { Ator } from 'src/app/shared/models/ator.model';

@Component({
  selector: 'app-peso-politico',
  templateUrl: './peso-politico.component.html',
  styleUrls: ['./peso-politico.component.scss']
})
export class PesoPoliticoComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: Ator;
  public idAtor: string;

  constructor(
    private atorService: AtorService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
      });
    this.getDadosParlamentar(this.idAtor);
  }

  getDadosParlamentar(idParlamentar) {
    forkJoin(
      [
        this.atorService.getAtor(idParlamentar),
        this.atorService.getPesoPolitico()
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator: any = data[0][0];
        const pesoPolitico: any = data[1];

        const parlamentar = [ator].map(a => ({
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...a
        }));

        const pesosPoliticos = pesoPolitico.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        parlamentar.forEach(p => {
          p.peso_politico = this.normalizarPesoPolitico(p.peso_politico, Math.max(...pesosPoliticos));
        });

        this.parlamentar = parlamentar[0];
      },
        error => {
          console.log(error);
        }
      );
  }

  normalizarPesoPolitico(metrica: number, max: number): number {
    if (max !== 0) {
      return (metrica / max);
    }
    return 0;
  }
}
