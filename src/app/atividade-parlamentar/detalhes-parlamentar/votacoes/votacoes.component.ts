import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';

import { VotacoesSumarizadasService } from 'src/app/shared/services/votacoes-sumarizadas.service';

import { AtorService } from 'src/app/shared/services/ator.service';
import { Ator } from 'src/app/shared/models/ator.model';
import { VotacoesSumarizadas } from 'src/app/shared/models/votacoesSumarizadas.model';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit {

  private unsubscribe = new Subject();

  public idAtor: string;
  public interesse: string;
  public parlamentarInfo: Ator;
  public votacoesSumarizadas: VotacoesSumarizadas;

  constructor(
    private activatedRoute: ActivatedRoute,
    private atorService: AtorService,
    private votacoesSumarizadasService: VotacoesSumarizadasService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
    .pipe(takeUntil(this.unsubscribe))
    .subscribe(params => {
      this.idAtor = params.get('id');
      this.interesse = params.get('interesse');
      this.resgataVotacoesById(this.idAtor, this.interesse);
    });
  }

  private resgataVotacoesById(idAtor, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(interesse, idAtor),
        this.votacoesSumarizadasService.getVotacoesSumarizadasByID(idAtor)
      ]
    )
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator = data[0][0];
        const votacoes = data[1];
        this.votacoesSumarizadas = votacoes;
        this.parlamentarInfo = ator;
      });
  }

}
