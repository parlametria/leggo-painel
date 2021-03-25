import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { ComissoesCargo } from 'src/app/shared/models/comissaoPresidencia.model';
import { Relatorias } from 'src/app/shared/models/atorRelator.model';
import { Autoria } from 'src/app/shared/models/autoria.model';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';

@Component({
  selector: 'app-papeis-importantes',
  templateUrl: './papeis-importantes.component.html',
  styleUrls: ['./papeis-importantes.component.scss']
})
export class PapeisImportantesComponent implements OnInit {

  private unsubscribe = new Subject();

  public comissoes: ComissoesCargo[];
  public relatorias: Relatorias[];
  public autorias: Autoria[];
  public idAtor: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;
  public destaque: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private autoriasService: AutoriasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.tema = params.tema;
        this.destaque = this.tema === 'destaque';
        this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
        this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema, this.destaque);
      });
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema, destaque) {
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
    });
  }

}
