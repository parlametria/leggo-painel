import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-detalhes-parlamentar',
  templateUrl: './detalhes-parlamentar.component.html',
  styleUrls: ['./detalhes-parlamentar.component.scss']
})
export class DetalhesParlamentarComponent implements OnInit {

  urlFoto: string;
  nome_autor: string;
  partido: string;
  uf: string;

  constructor() { }

  ngOnInit(): void {
    const id_autor = 107283;
    this.urlFoto = `https://www.camara.leg.br/internet/deputado/bandep/${id_autor}.jpg`;
    this.nome_autor = 'Dep. Gleisi Hoffmann';
    this.partido = 'PT';
    this.uf = 'PR';
  }

}
