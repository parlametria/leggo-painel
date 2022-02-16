import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { takeUntil, skip } from 'rxjs/operators';

import { Autoria, ArvoreAutorias } from 'src/app/shared/models/autoria.model';
import { Ator } from 'src/app/shared/models/ator.model';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { ProposicoesService } from 'src/app/shared/services/proposicoes.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() parlamentar: Ator;

  interessesAtivos: any;
  public isLoading = new BehaviorSubject<boolean>(true);
  private unsubscribe = new Subject();

  readonly ORDER_TIPOS_PROPOSICAO = [
    'Prop. Original / Apensada',
    'Emenda',
    'Requerimento'
  ];

  constructor(
    public activeModal: NgbActiveModal,
    private autoriasService: AutoriasService,
    private proposicoesService: ProposicoesService
  ) { }


  ngOnInit() {
  }

  private carregaVisAtividade(parlamentar, interesses: any[]) {
    this.parlamentar = parlamentar;
    const autoriaReqs = interesses.map((interesse) => {
      return this.autoriasService.getAutorias(parlamentar.id_autor_parlametria, interesse.interesse, '', false);
    });
    forkJoin(autoriaReqs)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(responses => {
        this.interessesAtivos = responses.map((autorias: any[], i: number) => {
          return { interesse: interesses[i], acoes: autorias.map(a => a.id_leggo).filter((a, j, ids) => (ids.indexOf(a) === j)).length };
        }).filter(interesse => (interesse.acoes > 0));
        const totalReqs = this.interessesAtivos.map((ativo) => {
          return this.proposicoesService.getContagemProposicoes(ativo.interesse.interesse, '', false);
        });
        this.isLoading.next(false);
        forkJoin(totalReqs)
        .subscribe((totalResponses: any[]) => {
          this.interessesAtivos = this.interessesAtivos.map((ativo, i) => {
            ativo.interesse.total = totalResponses[i].numero_proposicoes;
            return ativo;
          });
        });
      });
  }
}
