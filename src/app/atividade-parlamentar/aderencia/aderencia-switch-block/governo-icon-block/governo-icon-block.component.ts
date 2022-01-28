import {
  Component, Input, ViewEncapsulation,
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-governo-icon-block',
  templateUrl: './governo-icon-block.component.html',
  styleUrls: ['./governo-icon-block.component.scss'],
})
export class GovernoIconBlockComponent {
  @Input() active: boolean;
}
