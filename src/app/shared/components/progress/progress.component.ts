import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  @Input() label: string;
  @Input() barraClasse: string;
  @Input() valor: number;
  @Input() min: number;
  @Input() max: number;
  @Input() exibirLabel: boolean;

  constructor() { }

  ngOnInit(): void {
    if (this.max !== undefined) {
      this.valor = this.valor / this.max;
    }
  }

}
