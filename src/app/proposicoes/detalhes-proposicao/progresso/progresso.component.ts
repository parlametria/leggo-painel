import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProgressoService } from 'src/app/shared/services/progresso.service';
import { takeUntil, skip } from 'rxjs/operators';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { ProgressoProposicao } from 'src/app/shared/models/proposicoes/progressoProposicao.model';
import { indicate } from 'src/app/shared/functions/indicate.function';

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
      }
    );
  }

  getProgressoById(idLeggo: string) {
    this.progressoService
    .getProgressoProposicaoById(idLeggo)
    .pipe(
      indicate(this.isLoading),
      takeUntil(this.unsubscribe))
    .subscribe(
      (progresso) => {
        this.progresso = progresso;
        console.log(this.progresso);
        this.isLoading.next(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
