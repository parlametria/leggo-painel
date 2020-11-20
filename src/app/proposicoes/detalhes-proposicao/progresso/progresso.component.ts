import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { takeUntil, skip } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';

import { ProgressoService } from 'src/app/shared/services/progresso.service';
import { ProgressoProposicao } from 'src/app/shared/models/proposicoes/progressoProposicao.model';

import { indicate } from 'src/app/shared/functions/indicate.function';
import {
  ordenaProgressoProposicao,
  resumirFasesProgresso,
} from 'src/app/shared/functions/process_progresso.function';

import * as moment from 'moment';

@Component({
  selector: 'app-progresso',
  templateUrl: './progresso.component.html',
  styleUrls: ['./progresso.component.scss'],
})
export class ProgressoComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  idLeggo: string;
  progresso: ProgressoProposicao[];
  fasesResumidas: ProgressoProposicao[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private progressoService: ProgressoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
        if (this.idLeggo !== undefined) {
          this.getProgressoById(this.idLeggo);
        }
      });
  }

  ordenaProgresso(progresso) {
    return ordenaProgressoProposicao(progresso);
  }

  resumirFases(fases) {
    return resumirFasesProgresso(fases);
  }

  getProgressoById(idLeggo: string) {
    this.progressoService
      .getProgressoProposicaoById(idLeggo)
      .pipe(indicate(this.isLoading), takeUntil(this.unsubscribe))
      .subscribe(
        (progresso) => {
          this.progresso = progresso;
          this.fasesResumidas = this.resumirFases(
            this.ordenaProgresso(this.progresso)
          );
          console.log(this.fasesResumidas);
          this.isLoading.next(false);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  isInProgress(fase) {
    const now = new Date();
    return (
      (fase.data_inicio != null && fase.data_fim == null) ||
      new Date(fase.data_fim) > now
    );
  }

  isComissoes(fase) {
    return fase.local === 'Comissões';
  }

  isFinished(fase) {
    const now = new Date();
    return fase.data_fim != null && new Date(fase.data_fim) < now;
  }

  isJumpedFase(fase) {
    return fase.pulou;
  }

  isFuture(fase) {
    return (
      fase.data_fim == null &&
      fase.data_inicio == null &&
      !this.isJumpedFase(fase)
    );
  }

  formatDate(date) {
    return moment(date).format('DD/MM/YYYY');
  }

  formataFase(fase) {
    if (fase.is_mpv) {
      return fase.fase_global;
    }

    return fase.fase_global + ' - ' + fase.local;
  }

  styleFase(fase) {
    return {
      active: this.isFinished(fase),
      future: this.isFuture(fase),
      jumped: this.isJumpedFase(fase),
      inProgress: this.isInProgress(fase),
      senado:
        fase.local_casa === 'senado' || fase.fase_global === 'Senado Federal',
      camara:
        fase.local_casa === 'camara' ||
        ['Câmara dos Deputados', 'Câmara dos Deputados - Revisão'].includes(
          fase.fase_global
        ),
      planalto:
        ['presidência da república', 'congresso'].includes(fase.local_casa) ||
        ['Sanção Presidencial/Promulgação'].includes(fase.fase_global),
      'comissao-mista': ['Comissão Mista'].includes(fase.fase_global),
    };
  }

  exibeData(data) {
    return this.formatDate(data) !== 'Invalid date';
  }

  exibeCasa(fase) {
    return (
      !fase.is_mpv &&
      fase.local_casa !== 'presidência da república' &&
      fase.local_casa !== 'congresso'
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
