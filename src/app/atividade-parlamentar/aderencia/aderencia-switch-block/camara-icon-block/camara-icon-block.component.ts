import {
  Component, Input, ViewEncapsulation,
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-camara-icon-block',
  templateUrl: './camara-icon-block.component.html',
  styleUrls: ['./camara-icon-block.component.scss'],
})
export class CamaraIconBlockComponent {
  @Input() active: boolean;
}
