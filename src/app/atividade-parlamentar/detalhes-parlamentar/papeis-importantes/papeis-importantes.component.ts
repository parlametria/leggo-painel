import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { ComissaoPresidencia } from 'src/app/shared/models/comissaoPresidencia.model';
import { AtorRelator } from 'src/app/shared/models/atorRelator.model';
import { Autoria } from 'src/app/shared/models/autoria.model';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-papeis-importantes',
  templateUrl: './papeis-importantes.component.html',
  styleUrls: ['./papeis-importantes.component.scss']
})
export class PapeisImportantesComponent implements OnInit {

  private unsubscribe = new Subject();

  public comissao: ComissaoPresidencia;
  public relatorias: AtorRelator;
  public autorias: Autoria[];
  public idAtor: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);

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
        this.getParlamentarDetalhado(this.idAtor, this.interesse);
      });
  }

  getParlamentarDetalhado(idParlamentar, interesse) {
    forkJoin(
      [
        this.comissaoService.getComissaoDetalhadaById(interesse, idParlamentar),
        this.relatoriaService.getRelatoriasDetalhadaById(interesse, idParlamentar),
        this.autoriasService.getAutoriasOriginais(Number(idParlamentar), interesse)
      ]
    )
    .subscribe(data => {
      this.comissao = data[0][0];
      this.relatorias = data[1][0];
      this.autorias = data[2];
      this.isLoading.next(false);
    });
  }

}
