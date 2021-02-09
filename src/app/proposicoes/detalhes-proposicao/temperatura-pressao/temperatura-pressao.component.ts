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
    this.eventosService.getEventosTramitação(idLeggo, 'reforma-tributaria')
      .pipe(indicate(this.isLoading))
      .subscribe(eventos => {
        this.eventos = eventos;
      });
  }

  dataOnChange(event) {
    console.log(event);

  }

}
