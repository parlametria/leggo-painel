import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entidade } from 'src/app/shared/models/entidade.model';
import { EntidadeService } from 'src/app/shared/services/entidade.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  idParlamentarDestaque: number;
  parlamentaresGovernismo: Entidade[];
  parlamentaresDisciplina: Entidade[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private entidadeService: EntidadeService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');

        if (this.idParlamentarDestaque !== undefined) {
          this.entidadeService.getParlamentaresExercicio('').subscribe(parlamentares => {
            this.parlamentaresDisciplina = [...parlamentares];
            this.parlamentaresGovernismo = [...parlamentares];
          });
        }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
