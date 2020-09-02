import { Component, OnInit, AfterContentInit, ChangeDetectorRef, Input } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TemasService } from '../../shared/services/temas.service';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit, AfterContentInit {

  @Input() interesse: string;
  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO = 'todos';
  public temaSelecionado: string;
  public casaSelecionada: string;
  public ativoSelecionado: string;
  temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }];
  casaBusca: any[] = [
    { casa: 'Parlamentares', casa_slug: 'todos' },
    { casa: 'Deputados', casa_slug: 'camara' },
    { casa: 'Senadores', casa_slug: 'senado' }];
  ativoBusca: any[] = [
    { ativo: 'mais ativos no congresso', ativo_slug: 'congresso' },
    { ativo: 'mais ativos no twitter', ativo_slug: 'twitter' }];

  constructor(
    private temasService: TemasService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router) { }

  ngOnInit(): void {
    this.getTemas();
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.temaSelecionado = params.tema;
        this.casaSelecionada = params.casa;
        this.ativoSelecionado = params.ativo;
        this.temaSelecionado === undefined ? this.temaSelecionado = this.FILTRO_PADRAO : this.temaSelecionado = this.temaSelecionado;
        this.casaSelecionada === undefined ? this.casaSelecionada = this.FILTRO_PADRAO : this.casaSelecionada = this.casaSelecionada;
        this.ativoSelecionado === undefined ? this.ativoSelecionado = 'congresso' : this.ativoSelecionado = this.ativoSelecionado;
      });
  }

  ngAfterContentInit() {
    this.cdRef.detectChanges();
  }

  getTemas() {
    this.temasService.getTemas(this.interesse)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(tema =>
        tema.forEach(item => this.temasBusca.push(item))
      );
  }

  onChangeTema(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.FILTRO_PADRAO) {
      queryParams.tema = item;
    } else {
      delete queryParams.tema;
    }
    this.router.navigate([], { queryParams });
  }

  onChangeCasa(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (item !== this.FILTRO_PADRAO) {
      queryParams.casa = item;
    } else {
      delete queryParams.casa;
    }
    this.router.navigate([], { queryParams });
  }

  onChangeAtivo(item: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    queryParams.ativo = item;
    this.router.navigate([], { queryParams });
  }

}
