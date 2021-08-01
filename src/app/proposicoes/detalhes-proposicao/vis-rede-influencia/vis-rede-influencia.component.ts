import { Component, OnInit } from '@angular/core';

import { select, selectAll } from 'd3-selection';

const d3 = Object.assign({}, {
  select,
  selectAll,
});

@Component({
  selector: 'app-vis-rede-influencia',
  template: '<div id="vis-rede-influencia" class="vis"></div>',
  styleUrls: ['./vis-rede-influencia.component.scss']
})
export class VisRedeInfluenciaComponent implements OnInit {

  private width;
  private height;
  private margin;
  private svg: any;
  private g: any;

  constructor(private ) { }

  ngOnInit(): void {
    const largura = (window.innerWidth > 1000) ? 1000 : window.innerWidth;
    this.margin = {
      left: 70,
      right: 70,
      top: 25,
      bottom: 60
    };
    this.width = largura - this.margin.right - this.margin.left;
    this.height = 400 - this.margin.top - this.margin.bottom;

    this.svg = d3
      .select('#vis-rede-influencia')
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns:svg', 'http://www.w3.org/2000/svg')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('viewBox', '0 0 ' +
        (this.width + this.margin.left + this.margin.right) + ' ' + (this.height + this.margin.top + this.margin.bottom));

    this.g = this.svg
      .append('g')
      .attr(
        'transform',
        'translate(' + this.margin.left + ',' + this.margin.top + ')'
      );


  }

}
