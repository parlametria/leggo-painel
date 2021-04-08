import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { indicate } from 'src/app/shared/functions/indicate.function';
import * as moment from 'moment';

import { EntidadeService } from 'src/app/shared/services/entidade.service';
import { VotacoesSumarizadasService } from 'src/app/shared/services/votacoes-sumarizadas.service';
import { AtorService } from 'src/app/shared/services/ator.service';

import { Entidade } from 'src/app/shared/models/entidade.model';
import { Ator } from 'src/app/shared/models/ator.model';
import { VotacoesSumarizadas } from 'src/app/shared/models/votacoesSumarizadas.model';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  idParlamentarDestaque: number;
  parlamentares: Entidade[];
  parlamentaresGovernismo: Entidade[];
  parlamentaresDisciplina: Entidade[];
  casaAutor: string;

  idAtor: string;
  interesse: string;
  parlamentarInfo: Ator;
  votacoesSumarizadas: VotacoesSumarizadas;

  isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private entidadeService: EntidadeService,
    private atorService: AtorService,
    private votacoesSumarizadasService: VotacoesSumarizadasService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');
        this.interesse = params.get('interesse');

        if (this.idParlamentarDestaque !== undefined) {

          this.resgataVotacoesById(this.idParlamentarDestaque, this.interesse);
        }
    });
  }

  private resgataVotacoesById(idAtor, interesse) {
    forkJoin(
      [
        this.atorService.getAtor(interesse, idAtor),
        this.votacoesSumarizadasService.getVotacoesSumarizadasByID(idAtor),
        this.entidadeService.getParlamentaresExercicio('')
      ]
    )
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(data => {
        const ator = data[0][0];
        const votacoes = data[1][0];
        const parlamentares = data[2];

        this.formataData(votacoes);
        this.parlamentarInfo = ator;
        this.parlamentares = parlamentares.filter(p => p.casa_autor === this.parlamentarInfo.casa_autor);
        this.parlamentaresDisciplina = [...this.parlamentares];
        this.parlamentaresGovernismo = [...this.parlamentares];
        this.isLoading.next(false);
      });
  }

  private formataData(data) {
    moment.updateLocale('pt', {
      months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio',
      'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    });

    data.ultima_data_votacao = moment(data.ultima_data_votacao).format('LL');
    this.votacoesSumarizadas = data;
  }

  getCasa(casa) {
    const textoCasa = (casa === 'camara') ? 'da Câmara' : 'do Senado';
    return textoCasa;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
