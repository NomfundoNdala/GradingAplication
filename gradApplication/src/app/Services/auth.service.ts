import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  private isLecture: boolean = false;
  private isAdmin: boolean = false;
  private isUserLoggedIn: boolean = false;

  constructor(router : Router) {}

   checkUserRights() {
    let userInfor = localStorage.getItem('userInfo');
    if (userInfor) {
      this.isUserLoggedIn = true;
      let jwt = JSON.parse(userInfor).jwt;
      const helper = new JwtHelperService();
     const decodedToken = helper.decodeToken(jwt);
     this.isAdmin = decodedToken.admin;
     this.isLecture = decodedToken.IsLecture;
    }
   }

   getIsAdmin() {
    return this.isAdmin;
   }

   getIsLecture() {
     return this.isLecture;
   }

   getIsUserLoggedIn(){ 
     return this.isUserLoggedIn;
   }

   logout() {                            // {4}
   this.isUserLoggedIn = false;
   //this.router.navigateByUrl('/login');
 }
}
