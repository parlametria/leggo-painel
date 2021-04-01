import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Entidade } from 'src/app/shared/models/entidade.model';
import { EntidadeService } from 'src/app/shared/services/entidade.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { indicate } from 'src/app/shared/functions/indicate.function';

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

  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private entidadeService: EntidadeService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');

        if (this.idParlamentarDestaque !== undefined) {
          this.casaAutor = String(this.idParlamentarDestaque).startsWith('1') ? 'camara' : 'senado';
          this.entidadeService.getParlamentaresExercicio('').subscribe(parlamentares => {
            this.parlamentares = parlamentares.filter(p => p.casa_autor === this.casaAutor);
            this.parlamentaresDisciplina = [...this.parlamentares];
            this.parlamentaresGovernismo = [...this.parlamentares];

            this.isLoading.next(false);
          });
        }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
