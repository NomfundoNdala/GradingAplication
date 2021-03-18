import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
 
  private linkedinUrl: string = 'https://www.linkedin.com/in/mohammadfaysal/';
  private twitterUrl: string = 'https://twitter.com/Grader86183323/';
 
  constructor() { }

  ngOnInit(): void {
  }

}
