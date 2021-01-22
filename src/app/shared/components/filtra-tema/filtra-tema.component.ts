import { Component, OnInit, AfterContentInit, ChangeDetectorRef, Input } from '@angular/core';
import { Params, Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TemasService } from '../../services/temas.service';

@Component({
  selector: 'app-filtra-tema',
  templateUrl: './filtra-tema.component.html',
  styleUrls: ['./filtra-tema.component.scss']
})
export class FiltraTemaComponent implements OnInit, AfterContentInit {

  @Input() interesse: string;
  private unsubscribe = new Subject();

  readonly FILTRO_PADRAO_TEMA = 'todos';
  public temaSelecionado: string;
  temasBusca: any[] = [{ tema: 'todos os temas', tema_slug: 'todos' }, { tema: 'destaque', tema_slug: 'destaque' }];

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
        this.temaSelecionado === undefined ? this.temaSelecionado = this.FILTRO_PADRAO_TEMA : this.temaSelecionado = this.temaSelecionado;
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

    if (item !== this.FILTRO_PADRAO_TEMA) {
      queryParams.tema = item;
    } else {
      delete queryParams.tema;
    }
    this.router.navigate([], { queryParams });
  }

}
