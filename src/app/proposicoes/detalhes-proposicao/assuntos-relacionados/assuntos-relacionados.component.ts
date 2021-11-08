import { Component, OnInit, Input } from '@angular/core';

import { Proposicao } from 'src/app/shared/models/proposicao.model';

@Component({
  selector: 'app-assuntos-relacionados',
  templateUrl: './assuntos-relacionados.component.html',
  styleUrls: ['./assuntos-relacionados.component.scss'],
})
export class AssuntosRelacionadosComponent implements OnInit {
  @Input() proposicao: Proposicao;

  constructor() {}

  ngOnInit(): void {}
}
