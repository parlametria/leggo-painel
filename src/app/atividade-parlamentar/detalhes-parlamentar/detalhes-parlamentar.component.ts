import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';
import * as moment from 'moment';

import { indicate } from 'src/app/shared/functions/indicate.function';
import { Ator } from 'src/app/shared/models/ator.model';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { AtorService } from 'src/app/shared/services/ator.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { EntidadeService } from 'src/app/shared/services/entidade.service';


import { ComissoesCargo } from 'src/app/shared/models/comissaoPresidencia.model';
import { Relatorias } from 'src/app/shared/models/atorRelator.model';
import { Autoria } from 'src/app/shared/models/autoria.model';

import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';

import { AtorAgregado } from '../../shared/models/atorAgregado.model';
import { ParlamentaresService } from '../../shared/services/parlamentares.service';

import { nest } from 'd3-collection';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorAgregado;
  public parlamentarInfo: Ator;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;
  public destaque: boolean;
  public comissoes: ComissoesCargo[];
  public relatorias: Relatorias[];
  public autorias: Autoria[];
  public toggleDrawer: boolean;
  public papeisImportantes;
  public totalDocs: number;
  public autoriasPorTipo: any;

  @ViewChild('tabslinks')
  tabslinks: ElementRef;


  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService,
    private atorService: AtorService,
    private pesoService: PesoPoliticoService,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private autoriasService: AutoriasService,
    private entidadeService: EntidadeService,
    private parlamentaresService: ParlamentaresService,

  ) { }

  ngOnInit(): void {
    this.toggleDrawer = true;
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
      });
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.interesse = params.interesse;
      this.tema = params.tema;
      this.destaque = this.tema === 'destaque';
      this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
      this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema, this.destaque);
      this.resgataDocumentos(this.interesse, this.tema, parseInt(this.idAtor, 10), this.destaque);
      this.getAtorInfo(this.idAtor, this.interesse);
    });
  }

  tabTo(tab: string) {
    const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    const urlSlices = this.router.url.split('?')[0].split('/');
    urlSlices.pop(); // remove last chunk, tab indicator
    urlSlices.push(tab); // add tab to switch

    this.router
      .navigate([urlSlices.join('/')], { queryParams })
      .then(() => {
        window.setTimeout(() => {
          this.tabslinks.nativeElement.scrollIntoView({behavior: 'smooth'});
        }, 500); // need to wait for tab do load
      });
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema, destaque) {
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');

    forkJoin(
      [
        this.comissaoService.getComissaoDetalhadaById(idParlamentar),
        this.relatoriaService.getRelatoriasDetalhadaById(interesse, idParlamentar, tema, destaque),
        this.autoriasService.getAutoriasOriginais(Number(idParlamentar), interesse, tema, destaque)

      ]
    )
    .subscribe(data => {
      this.comissoes = data[0];
      this.relatorias = data[1];
      this.autorias = data[2];
      this.isLoading.next(false);

      this.papeisImportantes = [
      { value: this.comissoes?.length,
        item: 'Presidências em comissões'},
      { value: this.relatorias?.length,
        item: 'Relatoria em proposições'},
      { value: this.autorias?.length,
        item: 'Autoria em proposições'}
      ];

    });
  }

  getParlamentarAgregado(casa){
    const dataInicial = '2019-01-01';
    const dataFinal = moment().format('YYYY-MM-DD');
    this.parlamentaresService.setOrderBy('atuacao-parlamentar');
    this.parlamentaresService.getParlamentares(this.interesse, this.tema, casa, dataInicial, dataFinal, this.destaque)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentares => {
        this.parlamentar = parlamentares.filter(p => (`${p.id_autor_parlametria}` === this.idAtor))[0];
        this.isLoading.next(false);
      },
        error => {
          console.log(error);
        }
      );

  }

  routeInclude(part: string) {
    return this.router.url.includes(part);
  }

  getAtorInfo(idParlamentar, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(interesse, idParlamentar),
        this.pesoService.getPesoPoliticoById(idParlamentar)
      ]
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator = data[0][0];
        const pesoPolitico = data[1];

        ator.url_foto = this.getUrlFoto(ator);
        if (pesoPolitico.length) {
          ator.peso_politico = pesoPolitico[0].pesoPolitico;
        }
        this.getParlamentarAgregado(ator.casa_autor);
        this.parlamentarInfo = ator;
      });
  }

  private resgataDocumentos(interesse, tema, idAtor, destaque) {
    this.autoriasService.getAutorias(idAtor, interesse, tema, destaque)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        const autoriasApresentadas = autorias.filter(a => a.tipo_acao === 'Proposição');

        const ORDER_TIPOS_PROPOSICAO = [
          'Prop. Original / Apensada',
          'Emenda',
          'Requerimento'
        ];

        const d3 = Object.assign({}, { nest });
        this.autoriasPorTipo = d3.nest()
          .key((d: any) => d.tipo_documento)
          .sortKeys((a, b) => {
            const orderA = ORDER_TIPOS_PROPOSICAO.indexOf(a);
            const orderB = ORDER_TIPOS_PROPOSICAO.indexOf(b);
            if (orderA === -1) {
              return 1;
            }
            if (orderB === -1) {
              return -1;
            }
            return orderA - orderB;
          })
          .entries(autoriasApresentadas);

        this.totalDocs = this.autoriasPorTipo.reduce((acc: any, current) => {
          return acc + current.values.length;
        }, 0);
      });
  }


  private getUrlFoto(parlamentar): string {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${parlamentar.id_autor}.jpg`;
    const urlFoto = parlamentar.casa_autor === 'camara' ? urlCamara : urlSenado;

    return urlFoto;
  }

  public formataTipo(tipo: string, qtd: number, ultimo: boolean): string {
    let tipoFormatado = tipo.toLowerCase();
    const isPlural = qtd > 1;
    const separador = (ultimo) ? '.' : ', ';
    if (tipoFormatado === 'prop. original / apensada') {
      if (!isPlural) {
        tipoFormatado = 'foi proposição';
      } else {
        tipoFormatado = 'foram proposições';
      }
    } else {
      if (isPlural) {
        tipoFormatado = 'foram ' + tipoFormatado + 's';
      } else {
        tipoFormatado = 'foi ' + tipoFormatado;
      }
    }
    return tipoFormatado + separador;
  }


  setToggleDrawer(){
    this.toggleDrawer = !this.toggleDrawer;
  }

  getLabel(valor: any, messagem: string): string {
    let label = '';
    if (valor === undefined || valor === null) {
      valor = '0';
    }
    label = valor + messagem;

    return label;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
