import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  isAdmin = false;
  userLoggedName ='logout';
  user: Object | undefined;
  isUserLoggedIn = false;

  constructor(private authService : AuthService, private router: Router) {
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
      this.isAdmin = authService.getIsAdmin();
      console.log(this.isAdmin);
      let userInformation = authService.getUserInfo();
      if(userInformation){
        this.user = userInformation;
        this.userLoggedName = userInformation.name;
      }
    }

   }

  ngOnInit(): void {

  }

  addLecturer()
{
 this.router.navigateByUrl('/lecturer')
} 
 Logout(){ 
    this.authService.logout();
  }

}
