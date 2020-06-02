import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proposicao-page-header',
  templateUrl: './proposicao-page-header.component.html',
  styleUrls: ['./proposicao-page-header.component.scss']
})
export class ProposicaoPageHeaderComponent implements OnInit {
  text:string = "proposicao-page-header";
  constructor() { }

  ngOnInit(): void {
  }

}
