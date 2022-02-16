import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-filtro-busca',
  templateUrl: './filtro-busca.component.html',
  styleUrls: ['./filtro-busca.component.scss']
})
export class FiltroBuscaComponent implements OnInit {
  @Input() totalParlamentares: number;

  ngOnInit(): void {
  }
}
