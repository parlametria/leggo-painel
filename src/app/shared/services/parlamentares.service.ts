import { Injectable } from '@angular/core';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { AtorAgregado } from '../models/atorAgregado.model';
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
  private orderBy = new BehaviorSubject<string>('');
  readonly ORDER_BY_PADRAO = 'atuacao-parlamentar';
  private interesse: string;

  private filtro = new BehaviorSubject<any>({});

  constructor(
    private autoriaService: AutoriasService,
    private comissaoService: ComissaoService,
    private pesoService: PesoPoliticoService,
    private relatoriaService: RelatoriaService,
    private entidadeService: EntidadeService,
    private twitterService: TwitterService
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
          )),
        switchMap(parlamentares => {
          return this.orderBy.pipe(map(par => parlamentares));
        }),
        tap(parlamentares => {
          if (this.orderBy.value === 'atuacao-parlamentar') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.atividade_parlamentar, b.atividade_parlamentar, a, b);
            });
          } else if (this.orderBy.value === 'peso-politico') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.peso_politico, b.peso_politico, a, b);
            });
          } else if (this.orderBy.value === 'atuacao-twitter') {
            parlamentares.sort((a, b) => {
              return this.orderByDesc(a.atividade_twitter, b.atividade_twitter, a, b);
            });
          } else if (this.orderBy.value === 'maior-governismo') {
            parlamentares.sort((a, b) => {
              // parlamentares sem governismo calculado devem ficar no final da lista
              const aGovernismo = a.governismo === null ? -1 : a.governismo;
              const bGovernismo = b.governismo === null ? -1 : b.governismo;

              return this.orderByDesc(aGovernismo, bGovernismo, a, b);
            });
          } else if (this.orderBy.value === 'menor-governismo') {
            parlamentares.sort((b, a) => {
              // parlamentares sem governismo calculado devem ficar no final da lista
              const aGovernismo = a.governismo === null ? 2 : a.governismo;
              const bGovernismo = b.governismo === null ? 2 : b.governismo;
              return this.orderByDesc(aGovernismo, bGovernismo, a, b);
            });
          } else if (this.orderBy.value === 'maior-disciplina') {
            parlamentares.sort((a, b) => {
              // parlamentares sem disciplina calculada devem ficar no final da lista
              const aDisciplina = (
                !a.bancada_suficiente ||
                a.bancada_suficiente === null ||
                a.disciplina === null) ? -1 : a.disciplina;
              const bDisciplina = (
                !b.bancada_suficiente ||
                b.bancada_suficiente === null ||
                b.disciplina === null) ? -1 : b.disciplina;

              return this.orderByDesc(aDisciplina, bDisciplina, a, b);
            });
          } else if (this.orderBy.value === 'menor-disciplina') {
            parlamentares.sort((b, a) => {
              // parlamentares sem disciplina calculada devem ficar no final da lista
              const aDisciplina = (
                !a.bancada_suficiente ||
                a.bancada_suficiente === null ||
                a.disciplina === null) ? 2 : a.disciplina;
              const bDisciplina = (
                !b.bancada_suficiente ||
                b.bancada_suficiente === null ||
                b.disciplina === null) ? 2 : b.disciplina;

              return this.orderByDesc(aDisciplina, bDisciplina, a, b);
            });
          }
          if (this.filtro.value.nome === '') { // evita que índice mude pela busca por nome
            parlamentares.map((p, index) => {
              p.indice = index;
            });
          }
        }))
      .subscribe(res => {
        if (this.parlamentares.value.length !== 0) {
          if (this.interesse === this.parlamentares.value[0].interesse) {
            this.parlamentaresFiltered.next(res);
          }
        }
      });
  }

  getParlamentares(
    interesse: string, tema: string, casa: string, dataInicial: string, dataFinal: string, destaque: boolean
  ): Observable<any> {
    this.interesse = interesse;

    forkJoin(
      [
        this.entidadeService.getParlamentaresExercicio(casa),
        this.autoriaService.getAutoriasAgregadas(interesse, tema, destaque),
        this.comissaoService.getComissaoPresidencia(),
        this.relatoriaService.getAtoresRelatores(interesse, tema, destaque),
        this.pesoService.getPesoPolitico(),
        this.twitterService.getAtividadeTwitter(interesse, tema, dataInicial, dataFinal, destaque),
        this.autoriaService.getAutoriasAgregadasProjetos(interesse, tema, destaque)
      ]
    )
      .subscribe(data => {
        const parlamentaresExercicio: any = data[0];
        const autoriasAgregadas: any = data[1];
        const comissaoPresidencia: any = data[2];
        const atoresRelatores: any = data[3];
        const pesoPolitico: any = data[4];
        const twitter: any = data[5];
        const autoriasProjetos: any = data[6];

        const parlamentares = parlamentaresExercicio.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === Number(p.id_parlamentar_voz)),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.autor_id_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === Number(p.idParlamentarVoz)),
          ...twitter.find(p => a.id_autor_parlametria === +p.id_parlamentar_parlametria),
          ...autoriasProjetos.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...a
        }));

        const tweets = parlamentares.map(p => {
          if (p.atividade_twitter) {
            return +p.atividade_twitter;
          }
          return 0;
        });

        const valoresGovernismo = parlamentares.map(p => {
          if (p.governismo) {
            return +p.governismo;
          }
          return 0;
        });

        const valoresAtividadeParlamentar = parlamentares.map(p => {
          if (p.quantidade_autorias) {
            return +p.quantidade_autorias;
          }
          return 0;
        });

        parlamentares.forEach(p => {
          p.interesse = interesse;
          p.nome_processado = p.nome_autor.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          p.atividade_parlamentar = this.normalizarAtividade(
            p.quantidade_autorias, Math.min(...valoresAtividadeParlamentar),
            Math.max(...valoresAtividadeParlamentar)
          );
          if (typeof p.atividade_twitter === 'undefined') {
            p.quantidade_tweets = 0;
          } else {
            p.quantidade_tweets = p.atividade_twitter;
          }
          p.peso_politico = p.pesoPolitico;
          p.atividade_twitter = this.normalizarAtividade(p.atividade_twitter, Math.min(...tweets), Math.max(...tweets));
          p.governismo = this.normalizarAtividade(p.governismo, Math.min(...valoresGovernismo), Math.max(...valoresGovernismo));
        });
        this.parlamentares.next(parlamentares);
      },
        error => console.log(error)
      );

    return this.parlamentaresFiltered.asObservable();
  }

  private normalizarAtividade(metrica: number, min: number, max: number): number {
    if (metrica === null) {
      return metrica;
    }
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

  private orderByDesc(a: number, b: number, aObj: AtorAgregado, bObj: AtorAgregado) {
    if (isNaN(b)) {
      return -1;
    }

    if (isNaN(a)) {
      return 1;
    }

    if (b < a) {
      return -1;
    } else if (b > a) {
      return 1;
    } else {
      if (bObj.nome_processado > aObj.nome_processado) {
        return 1;
      } else if (bObj.nome_processado > aObj.nome_processado) {
        return -1;
      }
      return 0;
    }
  }

  setOrderBy(orderBy: string) {
    if (orderBy === undefined || orderBy === '') {
      this.orderBy.next(this.ORDER_BY_PADRAO);
    } else {
      this.orderBy.next(orderBy);
    }
  }

}
