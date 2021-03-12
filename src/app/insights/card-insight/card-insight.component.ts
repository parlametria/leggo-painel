import { Component, Input, OnInit } from '@angular/core';

import { Insight } from 'src/app/shared/models/insight.model';

@Component({
  selector: 'app-card-insight',
  templateUrl: './card-insight.component.html',
  styleUrls: ['./card-insight.component.scss']
})
export class CardInsightComponent implements OnInit {

  @Input() insight: Insight;

  constructor() { }

  ngOnInit(): void {
  }

}
