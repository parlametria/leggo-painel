import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-stacked',
  templateUrl: './progress-stacked.component.html',
  styleUrls: ['./progress-stacked.component.scss']
})
export class ProgressStackedComponent {

  @Input() categorias: any[];
  @Input() min: number;
  @Input() max: number;

  constructor() { }

}
