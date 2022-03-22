import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, forkJoin, pipe } from 'rxjs';
import { indicate } from 'src/app/shared/functions/indicate.function';

// import { InteresseService } from 'src/app/shared/services/interesse.service';
// import { Interesse } from 'src/app/shared/models/interesse.model';

import { Tema } from 'src/app/shared/models/tema.model';
import { TemasPerfilParlamentarService } from 'src/app/shared/services/temas-perfil-parlamentar.service';

import {
  ProposiccoesPerfilParlamentarService,
  ProposicaoPerfilParlamentar
} from 'src/app/shared/services/proposiccoes-perfil-parlamentar.service';

import {
  OrientacaoPerfilParlamentarService,
  OrientacaoPerfilParlamentar
} from 'src/app/shared/services/orientacao-perfil-parlamentar.service';

import { Ator } from 'src/app/shared/models/ator.model';
import { AtorService } from 'src/app/shared/services/ator.service';

import {
  ParlamentaresPerfilParlamentarService,
  ParlamentarVotos
} from 'src/app/shared/services/parlamentares-perfil-parlamentar.service';

@Component({
  selector: 'app-votacoes',
  templateUrl: './votacoes.component.html',
  styleUrls: ['./votacoes.component.scss']
})
export class VotacoesComponent implements OnInit, OnDestroy {

  readonly SIM = 1;
  readonly NAO = -1;
  readonly FALTOU = 0;
  readonly OBSTRUCAO = 2;
  readonly ABSTENCAO = 3;
  readonly LIBEROU = 5;

  private unsubscribe = new Subject();

  idParlamentarDestaque: number;
  // interesseParam?: string;
  // interesse?: Interesse;
  // interesses: Interesse[] = [];
  ator: Ator;
  parlamentarVotos: ParlamentarVotos;
  orientacao: OrientacaoPerfilParlamentar;
  proposicoesPerfilParlamentar: ProposicaoPerfilParlamentar[] = [];
  temasPerfilParlamentar: Tema[] = [];
  temaSelecionado: string;
  tema: Tema;
  isLoading = new BehaviorSubject<boolean>(true);
  mostrarDetalhesProposicoes = {};
  contagemVotosPorProposicao = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    // private interesseService: InteresseService,
    private atorService: AtorService,
    private proposiccoesPerfilService: ProposiccoesPerfilParlamentarService,
    private orientacaoPerfilParlamentarService: OrientacaoPerfilParlamentarService,
    private parlamentaresPerfilParlamentarService: ParlamentaresPerfilParlamentarService,
    private temasPerfilParlamentarService: TemasPerfilParlamentarService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');
      });

    this.activatedRoute.queryParams
      .subscribe(params => {
        // this.interesseParam = params.interesse;
        this.temaSelecionado = params.tema ?? 'todos';

        this.resgataDadosApi();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get nomeInteresse() {
    // return this.interesse?.nome_interesse ?? 'Todos os temas';
    if (this.tema?.tema && this.tema?.slug !== 'todos') {
      return this.tema?.tema;
    } else {
      return 'Todos os temas';
    }
  }

  get tituloDoAtor() {
    switch (this.ator.casa_autor) {
      case 'senado':
      case 'senador':
        return 'Senador(a)';

      case 'camara':
      case 'deputado':
        return 'Deputado(a)';

      default:
        return 'Parlamentar';
    }
  }

  getDataVotacao(isoData: string) {
    const date = new Date(isoData);
    return date.toLocaleDateString('pt-BR');
  }

  getUrlProposicao(id: number, casa: string): string {
    const camaraUrl = 'https://www.camara.leg.br/proposicoesWeb/fichadetramitacao?idProposicao=';
    const senadoUrl = 'https://www25.senado.leg.br/web/atividade/materias/-/materia/';
    const str = id + '';

    let url;

    if (casa === 'camara') {
      url = camaraUrl;
    } else {
      url = senadoUrl;
    }

    return url + str.substring(1, str.length);
  }

  getVotacaoClass(voto: number, tipo: string): string {
    switch (voto) {
      case this.SIM:
        return 'vota-sim';
      case this.NAO:
        return 'vota-nao';
      case this.FALTOU:
        return 'vota-faltou';
      case this.OBSTRUCAO:
        return 'vota-obstrucao';
      case this.LIBEROU:
        return 'vota-liberado';
      case this.ABSTENCAO:
        return 'vota-abstencao';
      case undefined:
        if (tipo === 'governo') {
          return 'vota-liberado';
        }
        return 'vota-faltou';
      case null:
        if (tipo === 'governo') {
          return 'vota-liberado';
        }
        return 'vota-faltou';
      default:
        return '';
    }
  }

  getContagemVotacoesPorPropocicao(proposicao: ProposicaoPerfilParlamentar) {
    const votosCountMap = {
      'vota-sim': 0,
      'vota-nao': 0,
      'vota-faltou': 0,
      'vota-obstrucao': 0,
      'vota-liberado': 0,
      'vota-abstencao': 0,
      '': 0
    };

    for (const votacao of proposicao.proposicaoVotacoes) {
      const cssClass = this.getVotacaoClass(this.parlamentarVotos.votos[votacao.idVotacao], 'parlamentar');
      votosCountMap[cssClass] += 1;
    }

    return votosCountMap;
  }

  onChangeTema(selectedTema: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.tema = selectedTema;

    this.router.navigate([], { queryParams });
  }

  onClickToggleMostrarDetalhesProposicao(id: string) {
    this.mostrarDetalhesProposicoes[id] = !this.mostrarDetalhesProposicoes[id];
  }

  private resgataDadosApi() {
    forkJoin([
      // this.interesseService.getInteresse(this.interesseParam),
      // this.interesseService.getInteresses(),
      this.atorService.getAtor('', String(this.idParlamentarDestaque)),
      this.orientacaoPerfilParlamentarService.getOrientacoesGoverno(),
      this.parlamentaresPerfilParlamentarService.getVotosParlamentar(String(this.idParlamentarDestaque)),
      this.temasPerfilParlamentarService.getTemas()
    ])
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      )
      .subscribe(data => {
        // this.interesse = data[0][0];
        // this.interesses = data[1];
        this.ator = data[0][0];
        this.orientacao = data[1];
        this.parlamentarVotos = data[2];
        this.temasPerfilParlamentar = [{ idTema: -1, slug: 'todos', tema: 'Todos' }, ...data[3]];
        this.tema = this.temasPerfilParlamentar.find(t => t.slug === this.temaSelecionado);

        this.getProposicoesPerfilParlamentar();
      });
  }

  private getProposicoesPerfilParlamentar() {
    this.proposiccoesPerfilService.getProposicoesOrientacao(this.ator.casa_autor)
      .subscribe(data => {
        if (this.temaSelecionado === 'todos') {
          this.proposicoesPerfilParlamentar = data;
        } else {
          this.proposicoesPerfilParlamentar = data.filter(prop => prop.temas.filter(t => t.slug === this.temaSelecionado).length !== 0);
        }

        for (const prop of this.proposicoesPerfilParlamentar) {
          this.mostrarDetalhesProposicoes[prop.idProposicao] = false;
          this.contagemVotosPorProposicao[prop.idProposicao] = this.getContagemVotacoesPorPropocicao(prop);
        }

        this.isLoading.next(false);
      });
  }
}
