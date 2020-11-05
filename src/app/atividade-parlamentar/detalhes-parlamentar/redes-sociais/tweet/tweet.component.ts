import { Component, Input, OnInit } from '@angular/core';

import { Tweet } from 'src/app/shared/models/tweet.model';

@Component({
  selector: 'app-tweet',
  templateUrl: './tweet.component.html',
  styleUrls: ['./tweet.component.scss']
})
export class TweetComponent implements OnInit {

  @Input() tweet: Tweet;

  constructor() { }

  ngOnInit(): void {
  }

}
