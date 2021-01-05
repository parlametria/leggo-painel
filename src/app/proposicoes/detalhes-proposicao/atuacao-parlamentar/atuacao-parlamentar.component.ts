import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { AtorService } from 'src/app/shared/services/ator.service';

@Component({
  selector: 'app-atuacao-parlamentar',
  templateUrl: './atuacao-parlamentar.component.html',
  styleUrls: ['./atuacao-parlamentar.component.scss']
})
export class AtuacaoParlamentarComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  idLeggo: string;

  atuacao: any[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriaService: AutoriasService,
    private atorService: AtorService) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
        if (this.idLeggo !== undefined) {
          this.getAtuacaoParlamentar(this.idLeggo);
        }
      });
  }

  getAtuacaoParlamentar(idLeggo: string) {
    forkJoin([
      this.autoriaService.getAutoriasPorProposicao(idLeggo),
      this.atorService.getAtoresBancadas()
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        const autorias = data[0];
        const bancadas = data[1];

        const atuacao = autorias.map(a => ({
          bancada: this.getProperty(bancadas.find(p => a.id_autor_parlametria === p.id_autor_parlametria),
            'bancada'),
          ...a
        }));
        console.log(atuacao);
        this.atuacao = atuacao;
      });
  }

  private getProperty(objeto: any, property: string) {
    if (objeto === undefined) {
      return undefined;
    } else {
      return objeto[property];
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
