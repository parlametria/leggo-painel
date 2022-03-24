import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { takeUntil, skip } from 'rxjs/operators';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';
import { ComissoesCargo } from 'src/app/shared/models/comissaoPresidencia.model';
import { Relatorias } from 'src/app/shared/models/atorRelator.model';
import { Autoria } from 'src/app/shared/models/autoria.model';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';

const DEFAULT_INTERESSE: Interesse = {
  nome_interesse: 'Todos os painéis',
  descricao_interesse: '',
  interesse: 'todos'
};

@Component({
  selector: 'app-papeis-importantes',
  templateUrl: './papeis-importantes.component.html',
  styleUrls: ['./papeis-importantes.component.scss']
})

export class PapeisImportantesComponent implements OnInit {

  private unsubscribe = new Subject();

  public comissoes: ComissoesCargo[];
  public relatorias: Relatorias[];
  public autorias: Autoria[];
  public idAtor: string;
  public interesse: string;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;
  public destaque: boolean;
  public interesses: Interesse[] = [DEFAULT_INTERESSE];
  public selectedInteresse: Interesse = DEFAULT_INTERESSE;

  constructor(
    private activatedRoute: ActivatedRoute,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private interesseService: InteresseService,
    private router: Router,
    private autoriasService: AutoriasService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idAtor = params.get('id');
      });
    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesse = params.interesse;
        this.tema = params.tema;
        this.destaque = this.tema === 'destaque';
        this.tema === undefined || this.destaque ? this.tema = '' : this.tema = this.tema;
        this.getParlamentarDetalhado(this.idAtor, this.interesse, this.tema, this.destaque);

        if (this.interesses.length === 1) { // apenas o DEFAULT
          this.resgataInteresses();
        }
      });
  }

  getParlamentarDetalhado(idParlamentar, interesse, tema, destaque) {
    forkJoin(
      [
        this.comissaoService.getComissaoDetalhadaById(idParlamentar),
        this.relatoriaService.getRelatoriasDetalhadaById(interesse, idParlamentar, tema, destaque),
        this.autoriasService.getAutoriasOriginais(Number(idParlamentar), interesse, tema, destaque)
      ]
    )
    .subscribe(data => {
      this.comissoes = data[0];
      this.relatorias = data[1];
      this.autorias = data[2];
      this.isLoading.next(false);
    });
  }

  private resgataInteresses() {
    this.interesseService.getInteresses()
      .subscribe((data) => {
        const interesses = data.filter((i) => i.interesse !== 'leggo');
        this.interesses = [DEFAULT_INTERESSE, ...interesses];

        if (this.interesse === undefined) {
          this.selectedInteresse = DEFAULT_INTERESSE;
        } else {
          const found = this.interesses.find(i => i.interesse === this.interesse);
          this.selectedInteresse = found ?? DEFAULT_INTERESSE;
        }
      });
  }

  interesseSelecionado(value: string) {
    const interesse = this.interesses.find(i => i.interesse === value);

    if (interesse === undefined) {
      console.log('interesse not found');
      return;
    }

    this.selectedInteresse = interesse;

    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (this.selectedInteresse.interesse !== DEFAULT_INTERESSE.interesse) {
      queryParams.interesse = this.selectedInteresse.interesse;
    } else {
      queryParams.interesse = undefined;
    }

    const { scrollX, scrollY } = window;
    this.router.navigate([], { queryParams })
      .then(() => {
        window.scrollTo(scrollX, scrollY);
      });
  }

}
