import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { indicate } from 'src/app/shared/functions/indicate.function';
import { AutoriasService } from 'src/app/shared/services/autorias.service';

@Component({
  selector: 'app-rede-influencia',
  templateUrl: './rede-influencia.component.html',
  styleUrls: ['./rede-influencia.component.scss']
})
export class RedeInfluenciaComponent implements OnInit {

  private unsubscribe = new Subject();
  isLoading = new BehaviorSubject<boolean>(true);

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriasService: AutoriasService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        const idLeggo = params.get('id_leggo');

        if (idLeggo !== undefined) {
          this.getCoautorias(idLeggo);
        }
      });
  }

  getCoautorias(idLeggo) {
    forkJoin(
      [
        this.autoriasService.getCoautorias(idLeggo),
        this.autoriasService.getCoautoriasLigacoes(idLeggo)
      ]).pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe(data => {
        console.log(data);
      });
  }

}
