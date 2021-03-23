import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
 

  private twitterUrl: string = 'https://twitter.com/Grader86183323/';
 
  constructor() { }

  ngOnInit(): void {
  }

}
