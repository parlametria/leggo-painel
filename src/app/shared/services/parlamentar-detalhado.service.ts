import { Injectable } from '@angular/core';

import { forkJoin, BehaviorSubject, Observable } from 'rxjs';

import { ProposicoesService } from 'src/app/shared/services/proposicoes.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { AtorDetalhado } from '../models/atorDetalhado.model';
import { AtorService } from './ator.service';
import { TwitterService } from 'src/app/shared/services/twitter.service';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarDetalhadoService {

  private parlamentarDetalhado = new BehaviorSubject<AtorDetalhado>(null);

  constructor(
    private proposicaoService: ProposicoesService,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private autoriasService: AutoriasService,
    private atorService: AtorService,
    private twitterService: TwitterService) { }

  getParlamentarDetalhado(idParlamentar: string, interesse: string, tema: string): Observable<AtorDetalhado> {
    this.parlamentarDetalhado.next(null);
    forkJoin(
      [
        this.relatoriaService.getRelatoriasDetalhadaById(interesse, idParlamentar, tema),
        this.comissaoService.getComissaoDetalhadaById(interesse, idParlamentar, tema),
        this.autoriasService.getAutoriasOriginais(Number(idParlamentar), interesse, tema),
        this.atorService.getAtoresAgregadosByID(Number(idParlamentar), interesse, tema),
        this.twitterService.getAtividadeDetalhadaTwitter(idParlamentar, interesse, tema)
      ]
    )
      .subscribe(data => {
        const ator: any = { id_autor_parlametria: idParlamentar };
        const relatorias = data[0];
        const comissoesPresidencia = data[1];
        const autorias = data[2];
        const atividadeParlamentar = data[3][0];
        const atividadeTwitter = data[4][0];

        const comissoesInfo = this.getComissoesProcessadas(comissoesPresidencia);
        atividadeParlamentar.atividade_parlamentar = this.normalizarAtividade(
          atividadeParlamentar.peso_documentos,
          atividadeParlamentar.min_peso_documentos,
          atividadeParlamentar.max_peso_documentos);

        const parlamentarDetalhado = ator;
        parlamentarDetalhado.autorias = autorias;
        parlamentarDetalhado.relatorias = relatorias;
        parlamentarDetalhado.comissoes = comissoesInfo;
        parlamentarDetalhado.atividadeParlamentar = atividadeParlamentar;
        parlamentarDetalhado.atividadeTwitter = atividadeTwitter;

        this.parlamentarDetalhado.next(parlamentarDetalhado);
      },
        error => {
          console.log(error);
        }
      );

    return this.parlamentarDetalhado.asObservable();
  }

  private getComissoesProcessadas(comissao) {
    let infoComissao = {};

    if (comissao.length !== 0) {
      infoComissao = {
        idComissao: comissao[0].id_comissao,
        info_comissao: comissao[0].info_comissao,
        quantidade_comissao_presidente: comissao[0].quantidade_comissao_presidente
      };
    }

    return infoComissao;
  }

  private normalizarAtividade(metrica: number, min: number, max: number): number {
    return (metrica - min) / (max - min);
  }

}
