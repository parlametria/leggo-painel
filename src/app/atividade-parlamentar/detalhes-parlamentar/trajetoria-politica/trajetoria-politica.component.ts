import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AtorService } from 'src/app/shared/services/ator.service';
import { ParlamentarService } from 'src/app/shared/services/parlamentar-perfil-parlamentar.service';
import { PerfilpoliticoSerenataService } from 'src/app/shared/services/perfilpolitico-serenata.service';

import { Eleicao, Afiliacao } from 'src/app/shared/models/candidato-serenata';

// key = ano
type TodosOsEventosPorAno = { [key: string]: { afiliacoes?: Afiliacao[], eleicao?: Eleicao } };

type TimeLapse = {
  periodo: { inicio: number, fim?: number };
  mandato?: Eleicao,
  afiliacoes: Afiliacao[]
};

@Component({
  selector: 'app-trajetoria-politica',
  templateUrl: './trajetoria-politica.component.html',
  styleUrls: ['./trajetoria-politica.component.scss']
})
export class TrajetoriaPoliticaComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();

  @Input() idAtor: string;

  trajetoriaPolitica: TimeLapse[] = [];

  constructor(
    private readonly atorService: AtorService,
    private readonly parlamentarService: ParlamentarService,
    private readonly perfilpoliticoSerenata: PerfilpoliticoSerenataService,
  ) { }

  ngOnInit(): void {
    this.atorService.getAtor('', this.idAtor)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((ator: any) => {
        this.fetchDadosParlamentar(ator[0].id_autor_parlametria);
      });
  }

  dataLocalizadaPtBr(data: string) {
    return (new Date(data)).toLocaleDateString('pt-BR');
  }

  private fetchDadosParlamentar(idAutorParlametria: string) {
    this.parlamentarService.getInfoById(idAutorParlametria)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(parlamentar => {
        this.fetchPerfilpoliticoSerenata(parlamentar.idPerfilPolitico);
      });
  }

  private fetchPerfilpoliticoSerenata(idPerfilPolitico: string) {
    this.perfilpoliticoSerenata.getCandidato(idPerfilPolitico)
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(candidato => {
        this.construirTrajetoriaPolitica(candidato.election_history, candidato.affiliation_history);
      });
  }

  private construirTrajetoriaPolitica(historicoEleicoes: Eleicao[], historicoAfiliacoes: Afiliacao[]) {
    let eventos: TodosOsEventosPorAno = {};
    eventos = this.preparaEventosAfilicoes(eventos, historicoAfiliacoes);
    const foiEleito = historicoEleicoes.filter(e => e.elected);
    eventos = this.preparaEventosEleicoes(eventos, foiEleito);

    const anosComEleicoes = foiEleito.map(e => e.year);

    const trajetoriaComEleicoes: TimeLapse[] = anosComEleicoes.map(ano => {
      const eleicao = eventos[ano].eleicao;
      const fim = eleicao.year + (eleicao.post === 'SENADOR' ? + 8 : 4);
      let afiliacoes = eventos[ano].afiliacoes !== undefined ? eventos[ano].afiliacoes : [];
      delete eventos[ano];

      // verifica se houve mudanças de afiliações dentro do mandato
      for (let i = ano + 1; i <= fim; ++i) {
        if (eventos[i] !== undefined && eventos[i].afiliacoes !== undefined) {
          afiliacoes = [...afiliacoes, ...eventos[i].afiliacoes];
          delete eventos[i];
        }
      }

      return {
        periodo: { inicio: ano, fim },
        mandato: eleicao,
        afiliacoes
      };
    });

    // Adiciona as afilições que sobraram na timeline
    const apenasAfiliacoes: TimeLapse[] = Object.keys(eventos).map(ano => {
      const afiliacoes = eventos[ano].afiliacoes !== undefined ? eventos[ano].afiliacoes : [];
      delete eventos[ano];

      return {
        periodo: { inicio: parseInt(ano, 10) },
        afiliacoes,
      };
    });

    const trajetoria = [...trajetoriaComEleicoes, ...apenasAfiliacoes];

    // sorteia do ano mais novo para o mais antigo
    this.trajetoriaPolitica = trajetoria.sort((a, b) => b.periodo.inicio - a.periodo.inicio);
  }

  private preparaEventosAfilicoes(eventos: TodosOsEventosPorAno, historicoAfiliacoes: Afiliacao[]): TodosOsEventosPorAno {
    for (const afiliacao of historicoAfiliacoes) {
      const ano = (new Date(afiliacao.started_in)).getFullYear();

      // se ja existe um evento, adiciona a afiliacao
      if (eventos[ano] !== undefined) {
        if (eventos[ano].afiliacoes !== undefined) {
          eventos[ano].afiliacoes.push(afiliacao);
        } else {
          eventos[ano].afiliacoes = [afiliacao];
        }
      } else { // se nao existe, cria um novo evento
        eventos[ano] = {
          afiliacoes: [afiliacao]
        };
      }
    }

    return eventos;
  }

  private preparaEventosEleicoes(eventos: TodosOsEventosPorAno, historicoEleicoes: Eleicao[]): TodosOsEventosPorAno {
    for (const eleicao of historicoEleicoes) {

      // se ja existe um evento, adiciona a eleicao
      if (eventos[eleicao.year] !== undefined) {
        eventos[eleicao.year].eleicao = eleicao;
      } else { // se nao existe, cria um novo evento
        eventos[eleicao.year] = { eleicao };
      }
    }

    return eventos;
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
