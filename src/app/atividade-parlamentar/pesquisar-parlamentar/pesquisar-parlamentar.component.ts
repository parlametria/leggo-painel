import { Component, OnInit , Input, Output, EventEmitter } from '@angular/core';
import { AtorAgregado } from '../../shared/models/atorAgregado.model';


@Component({
  selector: 'app-pesquisar-parlamentar',
  templateUrl: './pesquisar-parlamentar.component.html',
  styleUrls: ['./pesquisar-parlamentar.component.scss']
})
export class PesquisarParlamentarComponent implements OnInit {

  @Input() placeHolder:string;
  @Input() searchInput:string;
  @Input() rawData:AtorAgregado[];

  @Output() searchOutput = new EventEmitter<AtorAgregado[]>();

  constructor() { }

  ngOnInit(): void {
  }

  sendSearchOutput() {
    this.searchOutput.emit(
      this.rawData.filter(a => a.nome_autor.includes(this.searchInput)) as AtorAgregado[])
  }
}
