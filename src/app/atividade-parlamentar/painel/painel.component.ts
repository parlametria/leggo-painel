import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.scss']
})
export class PainelComponent implements OnInit {
  orderOptions:string[];
  search:string;

  constructor() {
    this.orderOptions = [
      "Mais ativos no congresso",
      "Mais ativos no Twitter",
      "Mais papéis importantes",
      "Maior peso político"
    ]
  }

  ngOnInit(): void {
  }

}
