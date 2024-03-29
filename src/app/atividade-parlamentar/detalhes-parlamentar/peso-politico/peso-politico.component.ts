import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { PesoPoliticoService } from 'src/app/shared/services/peso-politico.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-peso-politico',
  templateUrl: './peso-politico.component.html',
  styleUrls: ['./peso-politico.component.scss']
})
export class PesoPoliticoComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  public peso: number;
  public idAtor: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private pesoPoliticoService: PesoPoliticoService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
        this.getPesoPolitico(this.idAtor);
      });
  }

  getPesoPolitico(idAtor) {
    this.pesoPoliticoService
      .getPesoPoliticoById(idAtor)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.peso = parlamentar.length ? +parlamentar[0].pesoPolitico : 0;

        this.isLoading.next(false);
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }


}
