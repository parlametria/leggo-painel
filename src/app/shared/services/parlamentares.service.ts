import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AtorAgregado } from '../models/atorAgregado.model';
import { AtorService } from 'src/app/shared/services/ator.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { EntidadeService } from 'src/app/shared/services/entidade.service';
import { TwitterService } from 'src/app/shared/services/twitter.service';

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
    private relatoriaService: RelatoriaService,
    private entidadeService: EntidadeService,
    private twitterService: TwitterService
  ) {

    this.parlamentares
      .pipe(
        tap(parlamentares => {
          parlamentares.sort((a, b) => {
            if (isNaN(b.atividade_parlamentar)) {
              return -1;
            }

            if (isNaN(a.atividade_parlamentar)) {
              return 1;
            }

            return b.atividade_parlamentar - a.atividade_parlamentar;
          });
        }))
      .subscribe(res => {
        this.parlamentaresFiltered.next(res);
      });
  }

  getParlamentares(interesse: string, tema: string, casa: string): Observable<any> {
    forkJoin(
      [
        this.entidadeService.getParlamentaresExercicio(casa),
        this.atorService.getAtoresAgregados(interesse, tema),
        this.autoriaService.getAutoriasAgregadas(interesse, tema),
        this.comissaoService.getComissaoPresidencia(interesse, tema),
        this.relatoriaService.getAtoresRelatores(interesse, tema),
        this.pesoService.getPesoPolitico(),
        this.twitterService.getAtividadeTwitter(interesse, tema)
      ]
    )
      .subscribe(data => {
        const parlamentaresExercicio: any = data[0];
        const atores: any = data[1];
        const autoriasAgregadas: any = data[2];
        const comissaoPresidencia: any = data[3];
        const atoresRelatores: any = data[4];
        const pesoPolitico: any = data[5];
        const twitter: any = data[6];

        const parlamentares = parlamentaresExercicio.map(a => ({
          ...atores.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === p.id_autor_voz),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.autor_id_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...twitter.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
          ...a
        }));

        // Transforma os pesos para valores entre 0 e 1
        const pesos = parlamentares.map(p => {
          if (p.peso_documentos) {
            return +p.peso_documentos;
          }
          return 0;
        });

        const pesosPoliticos = parlamentares.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        const tweets = parlamentares.map(p => {
          if (p.atividade_twitter) {
            return +p.atividade_twitter;
          }
          return 0;
        });

        parlamentares.forEach(p => {
          p.atividade_parlamentar = this.normalizarAtividade(p.peso_documentos, Math.min(...pesos), Math.max(...pesos));
          p.atividade_twitter = this.normalizarAtividade(p.atividade_twitter, Math.min(...tweets), Math.max(...tweets));
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
