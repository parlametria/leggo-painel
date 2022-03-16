import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, forkJoin, pipe } from 'rxjs';
import { indicate } from 'src/app/shared/functions/indicate.function';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  idParlamentarDestaque: number;
  interesseParam?: string;
  interesse?: Interesse;
  interesses: Interesse[] = [];
  isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private interesseService: InteresseService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');
      });

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesseParam = params.interesse;

        this.resgataDadosApi();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get nomeInteresse() {
    return this.interesse?.nome_interesse ?? 'Todos os temas';
  }

  evtInteresseSelecionado(interesse: Interesse) {
    this.interesse = interesse;
  }

  // http://localhost:4200/parlamentares/270/votacoes?interesse=pandemia
  private resgataDadosApi() {
    forkJoin([
      this.interesseService.getInteresse(this.interesseParam),
      this.interesseService.getInteresses()
    ])
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      )
      .subscribe(data => {
        this.interesse = data[0][0];
        this.interesses = data[1];

        this.isLoading.next(false);
      });
  }

}
