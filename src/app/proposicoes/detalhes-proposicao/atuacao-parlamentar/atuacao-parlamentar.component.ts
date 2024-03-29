import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, forkJoin, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { nest } from 'd3-collection';
import { max } from 'd3-array';
const d3 = Object.assign({}, { nest, max });

import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { AtorService } from 'src/app/shared/services/ator.service';
import { indicate } from '../../../shared/functions/indicate.function';

@Component({
  selector: 'app-atuacao-parlamentar',
  templateUrl: './atuacao-parlamentar.component.html',
  styleUrls: ['./atuacao-parlamentar.component.scss']
})
export class AtuacaoParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  readonly ORDER_TIPOS_PROPOSICAO = [
    'Prop. Original / Apensada',
    'Emenda',
    'Requerimento'
  ];
  readonly NUMERO_PARLAMENTARES = 15;

  idLeggo: string;
  interesse: string;
  maximoDocumentos: number;
  p = 1;

  atuacao: any[];
  atuacaoGov: any[];
  atuacaoOp: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriaService: AutoriasService,
    private atorService: AtorService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesse = params.interesse;
      });

    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
        if (this.idLeggo !== undefined) {
          this.getAtuacaoParlamentar(this.idLeggo);
        }
      });
  }

  getAtuacaoParlamentar(idLeggo: string) {
    forkJoin([
      this.autoriaService.getAutoriasPorProposicao(idLeggo),
      this.atorService.getAtoresBancadas()
    ])
      .pipe(
        takeUntil(this.unsubscribe),
        indicate(this.isLoading))
      .subscribe(data => {
        const autorias = data[0];
        const bancadas = data[1];

        const atuacao = autorias.map(a => ({
          bancada: this.getProperty(bancadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
            'bancada'),
          ...a
        }));

        this.atuacao = d3.nest()
          .key((d: any) => d.id_autor_parlametria)
          .entries(atuacao);

        this.atuacao.map(parlamentar => {
          parlamentar.values.map(autoria => {
            autoria.valor = autoria.total_documentos;
            autoria.classe = this.getClasseTipoDocumento(autoria.tipo_documento);
            autoria.tooltip = this.getTooltip(autoria);
          });
          parlamentar.values.sort((a, b) => {
            const orderA = this.ORDER_TIPOS_PROPOSICAO.indexOf(a.tipo_documento);
            const orderB = this.ORDER_TIPOS_PROPOSICAO.indexOf(b.tipo_documento);
            if (orderA === -1) {
              return 1;
            }
            if (orderB === -1) {
              return -1;
            }
            return orderA - orderB;
          });
          parlamentar.soma_documentos = parlamentar.values.reduce((accum, item) => accum + item.total_documentos, 0);
          return parlamentar;
        });

        this.atuacaoGov = this.atuacao.filter(a => a.values[0].bancada === 'governo');
        this.atuacaoOp = this.atuacao.filter(a => a.values[0].bancada === 'oposição');

        this.atuacao.sort((a, b) => b.soma_documentos - a.soma_documentos);

        this.maximoDocumentos = d3.max(this.atuacao, d => +d.soma_documentos);

        this.isLoading.next(false);
      });
  }

  private getClasseTipoDocumento(tipoDocumento: string) {
    let classe = '';
    switch (tipoDocumento) {
      case 'Prop. Original / Apensada':
        classe = 'bg-proposicao';
        break;
      case 'Emenda':
        classe = 'bg-emenda';
        break;
      case 'Requerimento':
        classe = 'bg-requerimento';
        break;
      default:
        classe = 'bg-neutro';
        break;
    }
    return classe;
  }

  private getTooltip(atuacao) {
    const tipo: string = atuacao.tipo_documento.toLowerCase();

    let acoes = atuacao.total_documentos === 1 ? tipo : tipo + 's';

    if (atuacao.tipo_documento === 'Prop. Original / Apensada') {
      if (atuacao.total_documentos === 1) {
        acoes = 'proposição (esta ou apensada)';
      } else {
        acoes = 'proposições (esta ou apensada)';
      }
    }

    return atuacao.total_documentos + ' ' + acoes;
  }

  private getProperty(objeto: any, property: string) {
    if (objeto === undefined) {
      return undefined;
    } else {
      return objeto[property];
    }
  }

  pageChange(p: number) {
    this.p = p;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
