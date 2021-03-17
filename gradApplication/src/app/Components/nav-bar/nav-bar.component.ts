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
 
    this.checkUserIsLogged();
    setTimeout(() =>{
      this.checkUserIsLogged();
    } , 10000)

   }

   checkUserIsLogged(){
    if (this.authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
      this.isAdmin = this.authService.getIsAdmin();
      console.log(this.isAdmin);
      let userInformation = this.authService.getUserInfo();
      if(userInformation){
        this.user = userInformation;
        this.userLoggedName = userInformation.name;
      }
    }
   }
  ngOnInit(): void {

  }
  goHome()
  {
    this.router.navigateByUrl('/home');
  }

  addLecturer()
{
 this.router.navigateByUrl('/lecturer')
} 
 Logout(){ 
    this.authService.logout();
  }

}
