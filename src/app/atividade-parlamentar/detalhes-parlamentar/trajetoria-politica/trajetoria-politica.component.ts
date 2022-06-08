import { Component, OnDestroy, OnInit, Input } from '@angular/core';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-trajetoria-politica',
  templateUrl: './trajetoria-politica.component.html',
  styleUrls: ['./trajetoria-politica.component.scss']
})

export class TrajetoriaPoliticaComponent implements OnInit, OnDestroy {

  private unsubscribe = new Subject();
  @Input() idAtor: string;

  constructor(
  ) { }

  ngOnInit(): void {
    console.log('idAtor');
    console.log(this.idAtor);
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
