import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.scss']
})
export class LegendComponent implements OnInit {
  @Input() title: string;
  @Input() classe: string;
  @Input() rounded: boolean;
  @Input() striped: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  getClass(): string[] {
    const classes = ['legend-info', this.classe];
    if (this.rounded) {
      classes.push('legend-rounded');
    }

    return classes;
  }

}
