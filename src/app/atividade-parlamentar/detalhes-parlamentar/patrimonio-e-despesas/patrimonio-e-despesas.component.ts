import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { ParlamentarService } from 'src/app/shared/services/parlamentar-perfil-parlamentar.service';
import { PerfilpoliticoSerenataService } from 'src/app/shared/services/perfilpolitico-serenata.service';

import { Patrimonio } from 'src/app/shared/models/candidato-serenata';

@Component({
  selector: 'app-patrimonio-e-despesas',
  templateUrl: './patrimonio-e-despesas.component.html',
  styleUrls: ['./patrimonio-e-despesas.component.scss']
})
export class PatrimonioEDespesasComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  isLoading = new BehaviorSubject<boolean>(true);
  patrimonio: Patrimonio[] = [];
  obtevePatrimonio = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private atorService: AtorService,
    private parlamentarService: ParlamentarService,
    private perfilpolitico: PerfilpoliticoSerenataService,
  ) { }

  ngOnInit(): void {
    const url = window.location.href;
    const idAtor = url.split('/').reverse()[1];
    this.fetchDadosAtor(idAtor);
  }

  private fetchDadosAtor(idParlamentar: string) {
    this.atorService.getAtor('', idParlamentar)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((ator: any) => {
        this.fetchDadosParlamentar(ator[0].id_autor_parlametria);
      });
  }

  private fetchDadosParlamentar(idAutorParlametria: string) {
    this.parlamentarService.getInfoById(idAutorParlametria)
      .subscribe(parlamentar => {
        this.fetchPerfilpoliticoSerenata(parlamentar.idPerfilPolitico);
      });
  }

  private fetchPerfilpoliticoSerenata(idPerfilPolitico: string) {
    this.perfilpolitico.getCandidato(idPerfilPolitico)
      .subscribe(candidato => {
        this.patrimonio = candidato.asset_history;
        this.obtevePatrimonio = true;
        this.isLoading.next(false);
      });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
