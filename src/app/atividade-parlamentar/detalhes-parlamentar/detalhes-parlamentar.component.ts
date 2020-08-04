import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { AtorAgregado } from 'src/app/shared/models/atorAgregado.model';
import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';
import { AtorService } from 'src/app/shared/services/ator.service';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorDetalhado;
  public parlamentarAgregado: AtorAgregado;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private atorService: AtorService,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService,
    private pesoPoliticoService: PesoPoliticoService,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private autoriaService: AutoriasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.getDadosParlamentar(this.idAtor, this.interesse);
    this.getParlamentarDetalhado(this.idAtor, this.interesse);
  }

  getParlamentarDetalhado(idAtor, interesse) {
    this.parlamentarDetalhadoService
      .getParlamentarDetalhado(idAtor, interesse)
      .pipe(
        skip(1),
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar;
        this.isLoading.next(false);
      });
  }

  getDadosParlamentar(idParlamentar, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(idParlamentar),
        this.pesoPoliticoService.getPesoPolitico(),
        this.atorService.getAtoresAgregados(interesse),
        this.comissaoService.getComissaoPresidencia(),
        this.relatoriaService.getAtoresRelatores(this.interesse),
        this.autoriaService.getAutoriasAgregadas(this.interesse)
      ]
    ).pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator: any = data[0][0];
        const pesoPolitico: any = data[1];
        const atores: any = data[2];
        const comissaoPresidencia: any = data[3];
        const atoresRelatores: any = data[4];
        const autoriasAgregadas: any = data[5];

        const parlamentares = atores.map(a => ({
          ...autoriasAgregadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...comissaoPresidencia.find(p => a.id_autor_parlametria === p.id_autor_voz),
          ...atoresRelatores.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...pesoPolitico.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
          ...a
        }));

        const pesos = atores.map(p => +p.peso_documentos);
        const pesosPoliticos = pesoPolitico.map(p => {
          if (p.peso_politico) {
            return +p.peso_politico;
          }
          return 0;
        });

        parlamentares.forEach(p => {
          p.atividade_parlamentar = this.normalizarAtividade(p.peso_documentos, Math.min(...pesos), Math.max(...pesos));
          p.peso_politico = this.normalizarPesoPolitico(p.peso_politico, Math.max(...pesosPoliticos));
        });

        this.parlamentarAgregado = parlamentares.find(p => p.id_autor_parlametria === +idParlamentar);
        this.getUrlFoto();
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

  normalizarAtividade(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }

  getUrlFoto(): void {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${this.parlamentarAgregado.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${this.parlamentarAgregado.id_autor}.jpg`;
    this.urlFoto = this.parlamentarAgregado.casa === 'camara' ? urlCamara : urlSenado;
    this.getParlamentarDetalhado(this.idAtor, this.interesse);
  }

}
