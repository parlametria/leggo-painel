import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { takeUntil } from 'rxjs/operators';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import { indicate } from 'src/app/shared/functions/indicate.function';

import { Interesse } from 'src/app/shared/models/interesse.model';
import { InteresseService } from 'src/app/shared/services/interesse.service';

import { Proposicao } from 'src/app/shared/models/proposicao.model';
import { ProposicoesService } from 'src/app/shared/services/proposicoes.service';

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

const DEFAULT_INTERESSE: Interesse = Object.freeze({
  interesse: 'todos',
  nome_interesse: 'Todos os interesses',
  descricao_interesse: ''
});

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
  interesseParam?: string;
  interesse?: Interesse;
  interesses: Interesse[] = [];
  interesseSelecionado: string;
  ator: Ator;
  parlamentarVotos: ParlamentarVotos;
  orientacao: OrientacaoPerfilParlamentar;
  proposicoesPerfilParlamentar: ProposicaoPerfilParlamentar[] = [];
  isLoading = new BehaviorSubject<boolean>(true);
  mostrarDetalhesProposicoes = {};
  contagemVotosPorProposicao = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private interesseService: InteresseService,
    private atorService: AtorService,
    private proposicoesService: ProposicoesService,
    private proposiccoesPerfilService: ProposiccoesPerfilParlamentarService,
    private orientacaoPerfilParlamentarService: OrientacaoPerfilParlamentarService,
    private parlamentaresPerfilParlamentarService: ParlamentaresPerfilParlamentarService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(params => {
        this.idParlamentarDestaque = +params.get('id');
      });

    this.activatedRoute.queryParams
      .subscribe(params => {
        this.interesseParam = params.interesse;
        this.interesseSelecionado = this.interesseParam ?? 'todos';

        this.resgataDadosApi();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  get nomeInteresse() {
    return this.interesse?.nome_interesse ?? 'Todos os painéis';
  }

  get tituloDoAutor() {
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

  onChangeInteresse(selected: string) {
    const queryParams: Params = Object.assign({}, this.activatedRoute.snapshot.queryParams);

    if (selected === 'todos') {
      queryParams.interesse = undefined;
    } else {
      queryParams.interesse = selected;
    }

    this.router.navigate([], { queryParams });
  }

  onClickToggleMostrarDetalhesProposicao(id: string) {
    this.mostrarDetalhesProposicoes[id] = !this.mostrarDetalhesProposicoes[id];
  }

  private resgataDadosApi() {
    forkJoin([
      this.atorService.getAtor('', String(this.idParlamentarDestaque)),
      this.orientacaoPerfilParlamentarService.getOrientacoesGoverno(),
      this.parlamentaresPerfilParlamentarService.getVotosParlamentar(String(this.idParlamentarDestaque)),
      this.interesseService.getInteresse(this.interesseParam),
      this.interesseService.getInteresses(),
    ])
      .pipe(
        indicate(this.isLoading),
        takeUntil(this.unsubscribe)
      )
      .subscribe(data => {
        this.ator = data[0][0];
        this.orientacao = data[1];
        this.parlamentarVotos = data[2];
        this.interesse = data[3][0] ?? DEFAULT_INTERESSE;
        this.interesses = [DEFAULT_INTERESSE, ...data[4]];

        this.getProposicoesPerfilParlamentar();
      });
  }

  private getProposicoesPerfilParlamentar() {
    forkJoin([
      this.proposicoesService.getProposicoes(this.interesseParam),
      this.proposiccoesPerfilService.getProposicoesOrientacao(this.ator.casa_autor)
    ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(data => {
        this.proposicoesPerfilParlamentar = this.filtraProposicoesPorSigla(data[0], data[1]);

        for (const prop of this.proposicoesPerfilParlamentar) {
          this.mostrarDetalhesProposicoes[prop.idProposicao] = false;
          this.contagemVotosPorProposicao[prop.idProposicao] = this.getContagemVotacoesPorPropocicao(prop);
        }

        this.isLoading.next(false);
      });
  }

  private filtraProposicoesPorSigla(propsLeggo: Proposicao[], propsPerfil: ProposicaoPerfilParlamentar[]): ProposicaoPerfilParlamentar[] {
    // quando o interesse é todos proposicoesService.getProposicoes retorna [], então não tem por que filtrar
    if (propsLeggo.length === 0) {
      return propsPerfil;
    }

    // set com as siglas das proposicoes da api do leggo-backend
    const siglasSet = new Set<string>();

    for (const pLeggo of propsLeggo) {
      siglasSet.add((pLeggo.sigla_camara || pLeggo.sigla_senado || '').trim());
    }

    // retorna apenas as proposicoes da api do perfil-parlamentar cuja sigla(projetoLei) bate com as da api do leggo-backend
    return propsPerfil.filter(prop => siglasSet.has(prop.projetoLei.trim()));
  }
}
