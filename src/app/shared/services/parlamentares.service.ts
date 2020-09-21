import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { AtorAgregado } from '../models/atorAgregado.model';
import { AtorService } from 'src/app/shared/services/ator.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { EntidadeService } from 'src/app/shared/services/entidade.service';

@Injectable({
  providedIn: 'root'
})
export class ParlamentaresService {

  private parlamentares = new BehaviorSubject<Array<AtorAgregado>>([]);
  private parlamentaresFiltered = new BehaviorSubject<Array<AtorAgregado>>([]);
  private orderBy: string;
  readonly ORDER_BY_PADRAO = 'atuacao-parlamentar';

  private filtro = new BehaviorSubject<any>({});

  constructor(
    private atorService: AtorService,
    private autoriaService: AutoriasService,
    private comissaoService: ComissaoService,
    private pesoService: PesoPoliticoService,
    private relatoriaService: RelatoriaService,
    private entidadeService: EntidadeService
  ) {

    this.parlamentares
      .pipe(
        switchMap(parlamentar =>
          this.filtro.pipe(
            debounceTime(400),
            distinctUntilChanged(
              (p: any, q: any) => {
                return this.compareFilter(p, q);
              }
            ),
            map(filters => this.filter(parlamentar, filters))
          )
        ),
        tap(parlamentares => {
          if (this.orderBy === 'atuacao-parlamentar') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.atividade_parlamentar, b.atividade_parlamentar);
            });
          } else if (this.orderBy === 'peso-politico') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.peso_politico, b.peso_politico);
            });
          }
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
        this.pesoService.getPesoPolitico()
      ]
    )
      .subscribe(data => {
        const parlamentaresExercicio: any = data[0];
        const atores: any = data[1];
        const autoriasAgregadas: any = data[2];
        const comissaoPresidencia: any = data[3];
        const atoresRelatores: any = data[4];
        const pesoPolitico: any = data[5];

        const parlamentares = parlamentaresExercicio.map(a => ({
          ...atores.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === p.id_autor_voz),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.autor_id_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
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

        parlamentares.forEach(p => {
          p.nome_processado = p.nome_autor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
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

  search(filtro: any) {
    this.filtro.next(filtro);
  }

  private filter(parlamentar: AtorAgregado[], filtro: any) {
    const nome = filtro.nome;

    return parlamentar.filter(p => {
      let filtered = true;

      filtered =
        nome && filtered
          ? p.nome_processado.toLowerCase().includes(nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
          : filtered;

      return filtered;
    });
  }

  private compareFilter(p: any, q: any) {
    return p.nome === q.nome;
  }

  private orderByDesc(a: number, b: number) {
    if (isNaN(b)) {
      return -1;
    }

    if (isNaN(a)) {
      return 1;
    }

    return b - a;
  }

  setOrderBy(orderBy: string) {
    if (orderBy === undefined || orderBy === '') {
      this.orderBy = this.ORDER_BY_PADRAO;
    } else {
      this.orderBy = orderBy;
    }
  }

}
