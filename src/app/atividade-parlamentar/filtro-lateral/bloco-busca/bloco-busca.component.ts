import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Partido } from '../../../shared/models/partido.model';
import { PartidosService } from '../../../shared/services/partidos.service';
import { FiltroLateralService } from '../filtro-lateral.service';
import { ComissaoService } from '../../../shared/services/comissao.service';
import { Comissao } from '../../../shared/models/comissao.model';

const DEFAULT_PARTIDO: Partido = { idPartido: 0, sigla: 'Todos' };
const DEFAULT_COMISSAO: Comissao = { idComissaoVoz: '0', nome: 'Nenhum seleconado', sigla: '' };

const ESTADOS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF',
  'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA',
  'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS',
  'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

@Component({
  selector: 'app-bloco-busca',
  templateUrl: './bloco-busca.component.html',
  styleUrls: ['./bloco-busca.component.scss']
})
export class BlocoBuscaComponent implements OnInit {
  currentPartido: Partido = DEFAULT_PARTIDO;
  partidos: Partido[] = [DEFAULT_PARTIDO];
  currentEstado = 'Todos';
  estados: string[] = ['Todos', ...ESTADOS];
  currentComissao: Comissao = DEFAULT_COMISSAO;
  comissoes: Comissao[] = [DEFAULT_COMISSAO];
  private casa: 'senado'|'camara' = 'senado';


  constructor(
    private partidosService: PartidosService,
    private filtroLateralService: FiltroLateralService,
    private comissaoService: ComissaoService,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams
      .subscribe(params => {
        const casa = params.casa === 'senado' || params.casa === 'camara' ? params.casa : 'senado';
        this.casa = casa;
        this.fetchComissoes();
      });

    this.partidosService.getPartidos()
      .subscribe(partidos => {
        this.partidos = [...this.partidos, ...partidos];
      });

    this.filtroLateralService.selectedPartido
      .subscribe(partido => {
        this.currentPartido = partido;
      });

    this.filtroLateralService.selectedEstado
      .subscribe(estado => {
        if (estado === undefined || estado === '') {
          this.currentEstado = 'Todos';
        } else {
          this.currentEstado = estado;
        }
      });

    this.filtroLateralService.selectedComissao
      .subscribe(comissao => {
        if (comissao === undefined) {
          this.currentComissao = DEFAULT_COMISSAO;
        } else {
          this.currentComissao = comissao;
        }
      });
  }

  onChanageCurrentPartido(idPartido: string) {
    if (+idPartido === 0) {
      this.filtroLateralService.selectedPartido.next(undefined);
      return;
    }

    const partido = this.partidos.find(p => p.idPartido === +idPartido);

    if (partido !== undefined) {
      this.filtroLateralService.selectedPartido.next(partido);
    }
  }

  onChanageCurrentEstado(estado: string) {
    if (estado === 'Todos') {
      this.filtroLateralService.selectedEstado.next(undefined);
    } else {
      this.filtroLateralService.selectedEstado.next(estado);
    }
  }

  onChanageCurrentComissao(idComissaoVoz: string) {
    if (+idComissaoVoz === 0) {
      this.filtroLateralService.selectedComissao.next(undefined);
      return;
    }

    const comissao = this.comissoes.find(c => c.idComissaoVoz === idComissaoVoz);

    if (comissao !== undefined) {
      this.filtroLateralService.selectedComissao.next(comissao);
    }
  }

  private fetchComissoes() {
    this.comissaoService.getComissoes(this.casa)
      .subscribe(comissoes => {
        console.log('comissoes', comissoes);
        this.comissoes = [...this.comissoes, ...comissoes];
      });
  }

}
