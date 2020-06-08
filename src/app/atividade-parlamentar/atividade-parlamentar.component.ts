import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-atividade-parlamentar',
  templateUrl: './atividade-parlamentar.component.html',
  styleUrls: ['./atividade-parlamentar.component.scss']
})
export class AtividadeParlamentarComponent implements OnInit {
  option:string = "lista";
  
  constructor() { }

  ngOnInit(): void {
  }

}
