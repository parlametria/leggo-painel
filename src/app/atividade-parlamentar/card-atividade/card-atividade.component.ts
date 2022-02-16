import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { AtorAgregado } from 'src/app/shared/models/atorAgregado.model';

@Component({
  selector: 'app-card-atividade',
  templateUrl: './card-atividade.component.html',
  styleUrls: ['./card-atividade.component.scss']
})
export class CardAtividadeComponent implements OnInit {

  @Input() id: number;
  @Input() parlamentar: AtorAgregado;
  @Output() clickModal = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  emitModal() {
    this.clickModal.emit({ parlamentar: this.parlamentar });
  }
}
