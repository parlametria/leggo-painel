import { Component, Input, OnInit } from '@angular/core';
import { Interesse } from '../../models/interesse.model';
import { NgbAccordion, NgbPanel } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  @Input() interesseModel: Interesse;

  constructor() { }

  ngOnInit(): void {
  }

  scrollTop(e: any) {
    console.log('aaaaaa');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

}
