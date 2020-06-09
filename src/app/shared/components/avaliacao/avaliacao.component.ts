import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss']
})
export class AvaliacaoComponent implements OnInit {

  @Input() label: string;
  @Input() valor: number;
  @Input() exibirLabel: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
