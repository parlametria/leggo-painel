import {
  Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter
} from '@angular/core';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-aderencia-switch-block',
  templateUrl: './aderencia-switch-block.component.html',
  styleUrls: ['./aderencia-switch-block.component.scss'],
})
export class AderenciaSwitchBlockComponent implements OnInit {
  @Input() textLeft: string;
  @Input() imgLeft: string;
  @Input() textRight: string;
  @Input() imgRight: string;
  @Input() title: string;
  @Input() color: 'blue' | 'purple';

  @Output() selectedChangedEvent = new EventEmitter<string>();

  currentSelected: 'left' | 'right';

  ngOnInit(): void {
    this.currentSelected = 'left';
  }

  toggleCurrentSelected() {
    if (this.currentSelected === 'left') {
      this.currentSelected = 'right';
      this.selectedChangedEvent.emit(this.textRight);
    } else {
      this.currentSelected = 'left';
      this.selectedChangedEvent.emit(this.textLeft);
    }
  }

  getImg(pos: 'left' | 'right') {
    const img = pos === 'left' ? this.imgLeft : this.imgRight;

    if (pos === this.currentSelected) {
      return `${img}.png`;
    } else {
      return `${img}_inactive.png`;
    }
  }
}
