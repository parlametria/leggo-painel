import { Component, OnInit, ɵSWITCH_COMPILE_DIRECTIVE__POST_R3__ } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { ParlamentarDetalhadoService } from 'src/app/shared/services/parlamentar-detalhado.service';
import { AtorDetalhado } from 'src/app/shared/models/atorDetalhado.model';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  private unsubscribe = new Subject();

  public parlamentar: AtorDetalhado;
  public idAtor: string;
  public interesse: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private parlamentarDetalhado: ParlamentarDetalhadoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.interesse = params.get('interesse');
      });
    this.getParlamentarDetalhado(this.idAtor, this.interesse);
  }

  getParlamentarDetalhado(idAtor, interesse) {
    this.parlamentarDetalhado
      .getParlamentarDetalhado(idAtor, interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.parlamentar = parlamentar;
        console.log(parlamentar);
      });
  }

}
