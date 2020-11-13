import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Proposicao } from 'src/app/shared/models/proposicao.model'
import { ProposicaoDetalhadaService } from 'src/app/shared/services/proposicao-detalhada.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-detalhes-proposicao',
  templateUrl: './detalhes-proposicao.component.html',
  styleUrls: ['./detalhes-proposicao.component.scss']
})
export class DetalhesProposicaoComponent implements OnInit {

  private unsubscribe = new Subject();

  public proposicao: Proposicao;
  public idProposicao: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private proposicaoDetalhadaService: ProposicaoDetalhadaService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.interesse = params.get('interesse');
        this.idProposicao = params.get('id');
      });
    this.activatedRoute.queryParams
    .subscribe(params => {
      this.tema = params.tema;
      this.tema === undefined ? this.tema = '' : this.tema = this.tema;
    });  
  }

  getProposicaodetalhada(idProposicao, interesse) {
    this.proposicaoDetalhadaService
      .getProposicaoDetalhada(idProposicao, interesse)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(proposicao => {
        this.proposicao = proposicao;
        this.isLoading.next(false);
      })
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
