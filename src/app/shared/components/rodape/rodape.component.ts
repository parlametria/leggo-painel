import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.scss']
})
export class RodapeComponent {

  constructor(
    private router: Router,
  ) { }

  routeTo(url: string) {
    this.router.navigate([url]);
  }
}
