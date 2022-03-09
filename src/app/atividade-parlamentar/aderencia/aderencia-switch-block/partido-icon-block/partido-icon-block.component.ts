import {
  Component, Input, ViewEncapsulation,
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-partido-icon-block',
  templateUrl: './partido-icon-block.component.html',
  styleUrls: ['./partido-icon-block.component.scss'],
})
export class PartidoIconBlockComponent {
  @Input() active: boolean;
}
