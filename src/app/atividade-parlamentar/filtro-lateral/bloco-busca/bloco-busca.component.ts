import { Component, OnInit } from '@angular/core';

import { Partido } from '../../../shared/models/partido.model';
import { PartidosService } from '../../../shared/services/partidos.service';
import { FiltroLateralService } from '../filtro-lateral.service';

const DEFAULT_PARTIDO: Partido = { idPartido: 0, sigla: 'Todos' };

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

  constructor(
    private partidosService: PartidosService,
    private filtroLateralService: FiltroLateralService
  ) { }

  ngOnInit(): void {
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

  /*
  isCurrentPartido(partido: Partido) {
    if (this.currentPartido === undefined) {
      return false;
    }

    return this.currentPartido.idPartido === partido.idPartido;
  }
  */
}
