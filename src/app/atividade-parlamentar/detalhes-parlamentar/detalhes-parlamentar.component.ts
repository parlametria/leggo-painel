import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Ator } from 'src/app/shared/models/ator.model';
import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { indicate } from 'src/app/shared/functions/indicate.function';
import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';
import { AtorService } from 'src/app/shared/services/ator.service';
import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  p = 1;

  public parlamentar: AtorDetalhado;
  public parlamentarInfo: Ator;
  public idAtor: string;
  public interesse: string;
  public urlFoto: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private parlamentarDetalhadoService: ParlamentarDetalhadoService,
    private atorService: AtorService,
    private pesoService: PesoPoliticoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.tema = params.tema;
      this.tema === undefined ? this.tema = '' : this.tema = this.tema;
      this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema);
    });
    this.getAtorInfo(this.idAtor, this.interesse);
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema) {
    this.parlamentarDetalhadoService
      .getParlamentarDetalhado(idParlamentar, interesse, tema)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar;
        this.isLoading.next(false);
      });
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
          ator.peso_politico = pesoPolitico[0].peso_politico;
        }

        this.parlamentarInfo = ator;
      });
  }

  private getUrlFoto(parlamentar): string {
    const urlSenado = `https://www.senado.leg.br/senadores/img/fotos-oficiais/senador${parlamentar.id_autor}.jpg`;
    const urlCamara = `https://www.camara.leg.br/internet/deputado/bandep/${parlamentar.id_autor}.jpg`;
    const urlFoto = parlamentar.casa_autor === 'camara' ? urlCamara : urlSenado;

    return urlFoto;
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
