import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EventosService } from 'src/app/shared/services/eventos.service';
import { indicate } from 'src/app/shared/functions/indicate.function';

@Component({
  selector: 'app-temperatura-pressao',
  templateUrl: './temperatura-pressao.component.html',
  styleUrls: ['./temperatura-pressao.component.scss']
})
export class TemperaturaPressaoComponent implements OnInit {

  private unsubscribe = new Subject();
  public idLeggo: string;
  public isLoading = new BehaviorSubject<boolean>(true);

  public eventos;
  public filtro;

  constructor(
    private activatedRoute: ActivatedRoute,
    private eventosService: EventosService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.parent.paramMap
      .pipe(takeUntil(this.unsubscribe))
      .subscribe((params) => {
        this.idLeggo = params.get('id_leggo');
        if (this.idLeggo !== undefined) {
          this.getEventos(this.idLeggo);
        }
      });
  }

  getEventos(idLeggo) {
    this.eventosService.getEventosTramitacao(idLeggo, 'reforma-tributaria')
      .pipe(indicate(this.isLoading))
      .subscribe(eventos => {
        this.eventos = eventos;
      });
  }

  dataOnChange(event) {
    this.filtro = event;
    this.eventosService.pesquisar(event);
  }

  getSemanaString(data) {
    return 'Semana';
    // Semana de {{ filtro?.data.format('D') }} de {{ filtro?.data.format('MMM') }} a
    //       <!-- {{ filtro?.data.add(7, 'days').format('D') }} de {{ filtro?.data.add(7, 'days').format('MMM') }} -->
  }

}
