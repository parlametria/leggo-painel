import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { takeUntil, skip } from 'rxjs/operators';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';

import { ProgressoService } from 'src/app/shared/services/progresso.service';
import { ProgressoProposicao } from 'src/app/shared/models/proposicoes/progressoProposicao.model';

import { indicate } from 'src/app/shared/functions/indicate.function';
import {
  ordenaProgressoProposicao,
  resumirFasesProgresso,
} from 'src/app/shared/functions/process_progresso.function';

import * as moment from 'moment';
import {
  Proposicao,
  TramitacaoProposicao,
} from 'src/app/shared/models/proposicao.model';
import { ProposicaoDetalhadaService } from 'src/app/shared/services/proposicao-detalhada.service';

@Component({
  selector: 'app-progresso',
  templateUrl: './progresso.component.html',
  styleUrls: ['./progresso.component.scss'],
})
export class ProgressoComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();
  public isLoading = new BehaviorSubject<boolean>(true);

  idLeggo: string;
  interesse: string;
  progresso: ProgressoProposicao[];
  fasesResumidas: ProgressoProposicao[];
  proposicao: Proposicao;
  ultimaTramitacao: TramitacaoProposicao;

  constructor(
    private activatedRoute: ActivatedRoute,
    private progressoService: ProgressoService,
    private proposicaoDetalhadaService: ProposicaoDetalhadaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
      });

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesse = params.interesse;

        if (this.idLeggo !== undefined && this.interesse !== undefined) {
          this.getProgressoById(this.idLeggo, this.interesse);
        }
      });
  }

  ordenaProgresso(progresso) {
    return ordenaProgressoProposicao(progresso);
  }

  resumirFases(fases) {
    return fases;
  }

  getProgressoById(idLeggo: string, interesse: string) {
    forkJoin([
      this.progressoService.getProgressoProposicaoById(idLeggo),
      this.proposicaoDetalhadaService.getProposicaoDetalhada(
        idLeggo,
        interesse
      ),
    ])
      .pipe(indicate(this.isLoading), takeUntil(this.unsubscribe))
      .subscribe(
        (data) => {
          this.progresso = data[0];
          this.proposicao = data[1][0];

          this.ultimaTramitacao = this.proposicao.etapas
            .slice(-1)[0]
            .resumo_tramitacao.slice(-1)[0];

          this.fasesResumidas = this.resumirFases(
            this.ordenaProgresso(this.progresso)
          );

          this.isLoading.next(false);
        },
        (error) => {
          console.log(error);
        }
      );
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
      presidencia: fase.local_casa === 'presidência da república' ||
        ['Sanção Presidencial/Promulgação'].includes(fase.fase_global),
      congresso:
        ['congresso'].includes(fase.local_casa),
      'comissao-mista': ['Comissão Mista'].includes(fase.fase_global),
    };
  }

  localFase(fase) {
    let local = fase.local_casa === 'camara' ? 'Câmara' : 'Senado';
    if (fase.is_mpv ||
      fase.local_casa === 'presidência da república' ||
      fase.local_casa === 'congresso'
    ) {
      local = fase.local.replace('Presidência', 'Pres.');
    }
    return local;
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
    if (['Comissões', 'Plenário'].includes(fase.local)) {
      return fase.fase_global + ' - ' + fase.local;
    }
    return fase.fase_global;
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

  comissoesHistoric(fase) {
    let arrayComissoes = [];
    if (this.isComissoes(fase) && !fase.pulou && !this.isFuture(fase)) {
      if (fase.fase_global === 'Construção') {
        arrayComissoes = this.proposicao.etapas[0].comissoes_passadas;
      } else if (fase.fase_global === 'Revisão I') {
        arrayComissoes = this.proposicao.etapas[1].comissoes_passadas;
      }
    }
    return arrayComissoes.join(', ');
  }

  showHistoricoComissoes(fase) {
    return !(
      fase.is_mpv ||
      fase.local === 'Plenário' ||
      fase.local === 'Presidência da República' ||
      this.isFuture(fase)
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
