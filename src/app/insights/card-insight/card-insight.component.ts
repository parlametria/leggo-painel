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

  printInsight(insight) {
    const linhaRegex = /\r?\n|\r/g;
    const urlRegex = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/g;

    let str = insight.replace(linhaRegex, '<br>');

    const urlMatchs = str.match(urlRegex);
    if (urlMatchs !== null) {
      urlMatchs.forEach(match => {
        str = str.replace(match, `<a href="${match}" target="_blank">${match}</a>`);
      });
    }

    return str;
  }

}
