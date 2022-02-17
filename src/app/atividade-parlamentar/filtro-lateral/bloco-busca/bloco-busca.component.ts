import { Component, OnInit, } from '@angular/core';


@Component({
  selector: 'app-bloco-busca',
  templateUrl: './bloco-busca.component.html',
  styleUrls: ['./bloco-busca.component.scss']
})
export class BlocoBuscaComponent implements OnInit {
  partidos: any[] = ['Todos'];

  ngOnInit(): void {

  }
}
