import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';

import { nest } from 'd3-collection';

import { AutoriasService } from 'src/app/shared/services/autorias.service';

const d3 = Object.assign({}, { nest });

const DEFAULT_INTERESSE: Interesse = {
  nome_interesse: 'Todos os painéis',
  descricao_interesse: '',
  interesse: 'todos'
};

@Component({
  selector: 'app-atividade-no-congresso',
  templateUrl: './atividade-no-congresso.component.html',
  styleUrls: ['./atividade-no-congresso.component.scss']
})
export class AtividadeNoCongressoComponent implements OnInit {

  private unsubscribe = new Subject();
  public idAtor: string;
  public interesse: string;
  public tema: string;
  public parlamentar: any;
  public totalDocs: number;
  public autoriasPorTipo: any;
  public isLoading = new BehaviorSubject<boolean>(true);
  public destaque: boolean;
  public temDadosPorProposicao = false;
  public interesses: Interesse[] = [DEFAULT_INTERESSE];
  public selectedInteresse: Interesse = DEFAULT_INTERESSE;

  readonly ORDER_TIPOS_PROPOSICAO = [
    'Prop. Original / Apensada',
    'Emenda',
    'Requerimento'
  ];

  constructor(
    private activatedRoute: ActivatedRoute,
    private autoriaService: AutoriasService,
    private interesseService: InteresseService,
    private router: Router,
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
        this.resgataRanking(this.interesse, this.tema, this.idAtor, this.destaque);
        this.resgataDocumentos(this.interesse, this.tema, parseInt(this.idAtor, 10), this.destaque);

        if (this.interesses.length === 1) { // apenas o DEFAULT
          this.resgataInteresses();
        }
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

  private resgataRanking(interesse, tema, idAtor, destaque) {
    this.autoriaService.getAcoes(interesse, tema, destaque)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(acoes => {
        acoes.forEach(dado => {
          if (dado.tipo_acao === 'Proposição') {
            if (dado.id_autor_parlametria.toString() === idAtor.toString()) {
              this.parlamentar = dado;
              this.parlamentar.peso_total = +this.parlamentar.peso_total;
              return;
            }
          }
        });
        this.isLoading.next(false);
      });
  }

  private resgataDocumentos(interesse, tema, idAtor, destaque) {
    this.autoriaService.getAutorias(idAtor, interesse, tema, destaque)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(autorias => {
        const autoriasApresentadas = autorias.filter(a => a.tipo_acao === 'Proposição');
        this.autoriasPorTipo = d3.nest()
          .key((d: any) => d.tipo_documento)
          .sortKeys((a, b) => {
            const orderA = this.ORDER_TIPOS_PROPOSICAO.indexOf(a);
            const orderB = this.ORDER_TIPOS_PROPOSICAO.indexOf(b);
            if (orderA === -1) {
              return 1;
            }
            if (orderB === -1) {
              return -1;
            }
            return orderA - orderB;
          })
          .entries(autoriasApresentadas);

        this.totalDocs = this.autoriasPorTipo.reduce((acc: any, current) => {
          return acc + current.values.length;
        }, 0);
      });
  }

  public formataTipo(tipo: string, qtd: number, ultimo: boolean): string {
    let tipoFormatado = tipo.toLowerCase();
    const isPlural = qtd > 1;
    const separador = (ultimo) ? '.' : ', ';
    if (tipoFormatado === 'prop. original / apensada') {
      if (!isPlural) {
        tipoFormatado = 'foi proposição';
      } else {
        tipoFormatado = 'foram proposições';
      }
    } else {
      if (isPlural) {
        tipoFormatado = 'foram ' + tipoFormatado + 's';
      } else {
        tipoFormatado = 'foi ' + tipoFormatado;
      }
    }
    return tipoFormatado + separador;
  }
}
