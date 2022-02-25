import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { PartidosService } from '../../../shared/services/partidos.service';
import { FiltroLateralService } from '../filtro-lateral.service';
import { ComissaoService } from '../../../shared/services/comissao.service';

import { Partido } from '../../../shared/models/partido.model';
import { Comissao } from '../../../shared/models/comissao.model';
import { Lideranca } from 'src/app/shared/models/lideranca.model';

const DEFAULT_ESTADO = 'Todos';
const DEFAULT_PARTIDO: Partido = { idPartido: 0, sigla: 'Todos' };
const DEFAULT_COMISSAO: Comissao = { idComissaoVoz: '0', nome: 'Nenhum seleconado', sigla: '' };
const DEFAULT_CARGO: Lideranca = { cargo: 'Nenhum selecionado' };

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

  currentEstado = DEFAULT_ESTADO;
  estados: string[] = [DEFAULT_ESTADO, ...ESTADOS];

  currentComissao: Comissao = DEFAULT_COMISSAO;
  comissoes: Comissao[] = [DEFAULT_COMISSAO];

  currentCargo: Lideranca = DEFAULT_CARGO;
  cargos: Lideranca[] = [DEFAULT_CARGO];

  private casa: 'senado' | 'camara' = 'senado';


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
        this.fetchCargos();
      });

    this.partidosService.getPartidos()
      .subscribe(partidos => {
        this.partidos = [...this.partidos, ...partidos];
      });

    this.filtroLateralService.selectedPartido
      .subscribe(partido => {
        if (partido === undefined) {
          this.currentPartido = DEFAULT_PARTIDO;
        } else {
          this.currentPartido = partido;
        }
      });

    this.filtroLateralService.selectedEstado
      .subscribe(estado => {
        if (estado === undefined || estado === '') {
          this.currentEstado = DEFAULT_ESTADO;
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

    this.filtroLateralService.selectedCargo
      .subscribe(cargo => {
        if (cargo === undefined) {
          this.currentCargo = DEFAULT_CARGO;
        } else {
          this.currentCargo = cargo;
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

  onChanageCurrentCargo(cargo: string) {
    const lideranca = this.cargos.find(c => c.cargo === cargo);

    if (lideranca === undefined || lideranca.cargo === DEFAULT_CARGO.cargo) {
      this.filtroLateralService.selectedCargo.next(undefined);
    } else {
      this.filtroLateralService.selectedCargo.next(lideranca);
    }
  }

  checkDisplayCargoSelection(comissao: Comissao) {
    const id = +comissao.idComissaoVoz;
    return id > 0;
  }

  private fetchComissoes() {
    this.comissaoService.getComissoes(this.casa)
      .subscribe(comissoes => {
        this.comissoes = [DEFAULT_COMISSAO, ...comissoes];
      });
  }

  private fetchCargos() {
    this.comissaoService.getCargos(this.casa)
      .subscribe(cargos => {
        this.cargos = [DEFAULT_CARGO, ...cargos];
      });
  }
}
