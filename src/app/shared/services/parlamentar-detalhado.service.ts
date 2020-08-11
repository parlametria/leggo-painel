import { Injectable } from '@angular/core';

import { forkJoin, BehaviorSubject, Observable } from 'rxjs';

import { ProposicoesService } from 'src/app/shared/services/proposicoes.service';
import { ComissaoService } from 'src/app/shared/services/comissao.service';
import { RelatoriaService } from 'src/app/shared/services/relatoria.service';
import { AutoriasService } from 'src/app/shared/services/autorias.service';
import { AtorDetalhado } from '../models/atorDetalhado.model';

@Injectable({
  providedIn: 'root'
})
export class ParlamentarDetalhadoService {

  private parlamentarDetalhado = new BehaviorSubject<AtorDetalhado>(null);

  constructor(
    private proposicaoService: ProposicoesService,
    private comissaoService: ComissaoService,
    private relatoriaService: RelatoriaService,
    private autoriasService: AutoriasService) { }

  getParlamentarDetalhado(idParlamentar: string, interesse: string, tema: string): Observable<AtorDetalhado> {
    this.parlamentarDetalhado.next(null);
    forkJoin(
      [
        this.relatoriaService.getRelatoriasDetalhadaById(interesse, idParlamentar, tema),
        this.comissaoService.getComissaoDetalhadaById(interesse, idParlamentar, tema),
        this.autoriasService.getAutoriasOriginais(Number(idParlamentar), interesse, tema)
      ]
    )
      .subscribe(data => {
        const ator: any = { id_autor_parlametria: idParlamentar };
        const relatorias = data[0];
        const comissoesPresidencia = data[1];
        const autorias = data[2];

        const relatoriasInfo = this.getRelatoriasProcessadas(relatorias, interesse);
        const comissoesInfo = this.getComissoesProcessadas(comissoesPresidencia);

        const parlamentarDetalhado = ator;
        parlamentarDetalhado.autorias = autorias;
        parlamentarDetalhado.relatorias = relatoriasInfo;
        parlamentarDetalhado.comissoes = comissoesInfo;

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

  // TODO: Modificar retorno da API para considerar a sigla da proposição
  private getRelatoriasProcessadas(relatorias, interesse) {
    let ids = [];
    let quant = 0;

    if (relatorias !== undefined) {
      ids = relatorias[0].ids_relatorias;
      quant = relatorias[0].quantidade_relatorias;
    }

    const relatoriasLista = [];
    ids.forEach(id => {
      this.proposicaoService.getProposicoesById(interesse, id.id_leggo)
        .subscribe(idProp => {
          const prop = {
            idProp: id.id_leggo,
            sigla: idProp[0].etapas[0].sigla
          };
          relatoriasLista.push(prop);
        });
    });
    return relatoriasLista;
  }

}
