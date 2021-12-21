import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ProposicaoDetalhadaService } from 'src/app/shared/services/proposicao-detalhada.service';
import { InteresseService } from 'src/app/shared/services/interesse.service';
import { Interesse } from 'src/app/shared/models/interesse.model';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-detalhes-proposicao',
  templateUrl: './detalhes-proposicao.component.html',
  styleUrls: ['./detalhes-proposicao.component.scss'],
})
export class DetalhesProposicaoComponent implements OnInit, OnDestroy {
  private unsubscribe = new Subject();

  public proposicao: Proposicao;
  public eventosAgrupados: any;
  public idProposicao: string;
  public interesse: string;
  interesseModel: Interesse;
  public isLoading = new BehaviorSubject<boolean>(true);
  public tema: string;

  showDetails = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private interesseService: InteresseService,
    private router: Router,
    private proposicaoDetalhadaService: ProposicaoDetalhadaService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.interesse = params.get('interesse');
        this.idProposicao = params.get('id_leggo');
        this.getInteresse(this.interesse);
      });
    this.activatedRoute.queryParams.subscribe((params) => {
      this.tema = params.tema;
      this.tema === undefined ? (this.tema = '') : (this.tema = this.tema);
      this.getProposicaodetalhada(this.idProposicao, this.interesse);
    });
  }

  getInteresse(interesseArg: string) {
    this.interesseService
      .getInteresse(interesseArg)
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe))
      .subscribe((data) => {
        this.interesseModel = data[0];
        this.isLoading.next(false);
      });
  }

  getProposicaodetalhada(idProposicao, interesse) {
    this.proposicaoDetalhadaService
      .getProposicaoDetalhada(idProposicao, interesse)
      .pipe(indicate(this.isLoading), takeUntil(this.unsubscribe))
      .subscribe((proposicao) => {
        this.proposicao = proposicao[0];
        this.isLoading.next(false);

        if (this.proposicao === undefined || this.proposicao === null) {
          this.router.navigate(['notFound'], { skipLocationChange: true });
        }
      });
  }


  getCasaFormatada(casa): string {
    if (casa === 'camara') {
      return 'Câmara';
    } else if (casa === 'senado') {
      return 'Senado';
    }
    return '';
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  toogleShowDetails() {
    this.showDetails = !this.showDetails;
  }
}
