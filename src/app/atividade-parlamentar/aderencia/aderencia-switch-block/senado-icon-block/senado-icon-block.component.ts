import {
  Component, Input, ViewEncapsulation,
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-senado-icon-block',
  templateUrl: './senado-icon-block.component.html',
  styleUrls: ['./senado-icon-block.component.scss'],
})
export class SenadoIconBlockComponent {
  @Input() active: boolean;
}
