import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AtorAgregado } from '../models/atorAgregado.model';
import { AtorService } from 'src/app/shared/services/ator.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';

@Injectable({
  providedIn: 'root'
})
export class ParlamentaresService {

  private parlamentares = new BehaviorSubject<Array<AtorAgregado>>([]);
  private parlamentaresFiltered = new BehaviorSubject<Array<AtorAgregado>>([]);

  constructor(
    private atorService: AtorService,
    private autoriaService: AutoriasService,
    private comissaoService: ComissaoService,
    private pesoService: PesoPoliticoService,
    private relatoriaService: RelatoriaService
  ) {

    this.parlamentares
      .pipe(
        tap(parlamentares => {
          parlamentares.sort((a, b) => b.atividade_parlamentar - a.atividade_parlamentar);
        }))
      .subscribe(res => {
        this.parlamentaresFiltered.next(res);
      });
  }

  getParlamentares(interesse: string): Observable<any> {
    forkJoin(
      [
        this.atorService.getAtoresAgregados(interesse),
        this.autoriaService.getAutoriasAgregadas(interesse),
        this.comissaoService.getComissaoPresidencia(),
        this.relatoriaService.getAtoresRelatores(interesse),
        this.pesoService.getPesoPolitico()
      ]
    )
      .subscribe(data => {
        const atores: any = data[0];
        const autoriasAgregadas: any = data[1];
        const comissaoPresidencia: any = data[2];
        const atoresRelatores: any = data[3];
        const pesoPolitico: any = data[4];

        const parlamentares = atores.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === p.id_autor_voz),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...a
        }));

        // Transforma os pesos para valores entre 0 e 1
        const pesos = parlamentares.map(p => +p.peso_documentos);
        const pesosPoliticos = parlamentares.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        parlamentares.forEach(p => {
          p.atividade_parlamentar = this.normalizarAtividade(p.peso_documentos, Math.min(...pesos), Math.max(...pesos));
          p.peso_politico = this.pesoService.normalizarPesoPolitico(p.peso_politico, Math.max(...pesosPoliticos));
        });

        this.parlamentares.next(parlamentares);
      },
        error => console.log(error)
      );

    return this.parlamentaresFiltered.asObservable();
  }

  private normalizarAtividade(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }

}
