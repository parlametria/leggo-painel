import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { select, selectAll, mouse, event } from 'd3-selection';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { group, max, min } from 'd3-array';
import { axisLeft, axisBottom } from 'd3-axis';
import { hsl } from 'd3-color';
import { path } from 'd3-path';
import { forceSimulation, forceX, forceY, forceCollide } from 'd3-force';
import { format } from 'd3-format';
import { pie, arc } from 'd3-shape';

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
export class VisCabecalhoComponent implements OnInit, OnChanges {
  @Input() parlamentar: AtorAgregado;
  private svg: any;
  private svg1: any;
  private svg2: any;
  private radius1: any;
  private radius2: any;
  private donutWidth: any;
  constructor() { }

  ngOnInit(): void {
    const width = 200;
    const height = 200;
    this.donutWidth = 20;
    this.radius1 = Math.min(width, height) / 2;
    this.radius2 = this.radius1 - this.donutWidth;
    this.svg = d3
    .select('#vis-cabecalho')
    .append('svg')
    .attr('width', `${width}`)
    .attr('height', `${height}`);
    this.svg1 = this.svg.append('g')
      .attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');
    this.svg2 = this.svg.append('g')
      .attr('transform', 'translate(' + (width / 2) +
                  ',' + (height / 2) + ')');
  }

  ngOnChanges(){
    if (!(this.svg && this.svg1 && this.svg2)){
      return;
    }

    const disciplina = this.parlamentar?.disciplina || 0;
    const datasetDisciplina = [disciplina, 1 - disciplina];

    const governismo = this.parlamentar?.governismo || 0;
    const datasetGovernismo = [governismo, 1 - governismo];

    const colorGoverniso = '#50669A';
    const colorDisciplina = '#85CDE8';
    const colorOff = '#e5e6e7';
    const arc1 = d3.arc()
      .innerRadius(this.radius1 - this.donutWidth)
            .outerRadius(this.radius1);

    const arc2 = d3.arc()
      .innerRadius(this.radius2 - this.donutWidth)
      .outerRadius(this.radius2);


    const drawPie = d3.pie()
    .value((d: number) => {
        return d;
      })
      .sort(null);

    const path1 = this.svg1.selectAll('path')
      .data(drawPie(datasetDisciplina))
      .enter()
      .append('path')
      .attr('d', arc1)
      .attr('fill', (d, i: number) => {
        return d.index === 1 ? colorOff : colorDisciplina;
      });

    const path2 = this.svg2.selectAll('path')
      .data(drawPie(datasetGovernismo))
      .enter()
      .append('path')
      .attr('stroke', '#fff')
      .attr('stroke-width', '6')
      .attr('d', arc2)
      .attr('fill', (d, i) => {
        return d.index === 1 ? colorOff : colorGoverniso;
      });
  }

}
