import { Component, OnInit, Input } from '@angular/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
import { format } from 'd3-format';
import { line, curveMonotoneX, pie, arc } from 'd3-shape'

import { AtorAgregado } from '../../../shared/models/atorAgregado.model';


const d3 = Object.assign({}, {
  pie,
  arc,
  select,
  selectAll,
  scaleLinear,
  scaleOrdinal,
  group,
  max,
  min,
  axisLeft,
  axisBottom,
  mouse,
  hsl,
  path,
  forceSimulation,
  forceX,
  forceY,
  forceCollide,
  format
});

@Component({
  selector: 'app-vis-cabecalho',
  template: '<div id="vis-cabecalho"></div>',
  styleUrls: ['./vis-cabecalho.component.scss']
})
export class VisCabecalhoComponent implements OnInit {
  @Input() parlamentar: AtorAgregado 
  private svg: any;
  private svg1: any;
  private svg2: any;
  private svg3: any;

  constructor() { }

  ngOnInit(): void {
    var width = 200;
    var height = 200;
    var donutWidth = 75;
    var radius1 = Math.min(width, height) / 2;
    var radius2 = radius1 - donutWidth;
    
    var color1 = 'blue'
    var color2 = 'green'

     var dataset1 = [
      10, 20, 30, 40
    ];


    this.svg = d3
    .select('#vis-cabecalho')
    .append('svg')
    .attr('width', '400')
    .attr('height', '400')

    this.svg1 = this.svg.append('g')
      .attr('transform', 'translate(' + (400 / 2) + 
            ',' + (400 / 2) + ')');
    
    this.svg2 = this.svg.append('g')
      .attr('transform', 'translate(' + (400 / 2) + 
            ',' + (400 / 2) + ')');

    var arc1 = d3.arc()
          .innerRadius(radius1 - donutWidth)  
          .outerRadius(radius1);

    var arc2 = d3.arc()
      .innerRadius(radius2 - donutWidth)  
      .outerRadius(radius2);

      var pie = d3.pie()
        .value(function(d:any) { return d; })
        .sort(null);

      var path1 = this.svg1.selectAll('path')
        .data(pie(dataset1))
        .enter()
        .append('path')
        .attr('d', arc1)
        .attr('fill', function(d, i:number) { 
          if(i){
            console.log(d)
            console.log(i)
          }
          return 'blue';
        });


  }

}
