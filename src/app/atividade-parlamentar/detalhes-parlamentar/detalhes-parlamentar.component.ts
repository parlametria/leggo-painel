import { Component, OnInit, OnDestroy } from '@angular/core';
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
    });
    this.getAtorInfo(this.idAtor, this.interesse);
    this.papeisImportantes = [
      { value: this.parlamentar?.quantidade_comissao_presidente, 
        item: "Presidências em comissões"},
      { value: this.parlamentar?.quantidade_relatorias, 
        item: "Relatoria em proposições"},
      { value: this.parlamentar?.quantidade_autorias, 
        item: "Autoria em proposições"},
    ]
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

        parlamentares.map(prlmntr => {
          if(prlmntr.idParlamentarVoz === this.idAtor){
            this.parlamentar = prlmntr;//hy

          }
        })
        this.isLoading.next(false);
      },
        error => {
          console.log(error);
        }
      );

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
        this.getParlamentarAgregado(ator.casa_autor)
        this.parlamentarInfo = ator
      });
  }

  private getUrlFoto(parlamentar): string {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${parlamentar.id_autor}.jpg`;
    const urlFoto = parlamentar.casa_autor === 'camara' ? urlCamara : urlSenado;

    return urlFoto;
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
