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
  private userInfo:any = null;

  constructor(private router : Router) {}

   checkUserRights() {
    let userInfor = localStorage.getItem('userInfo');
    if (userInfor) {
      let userInforJson = JSON.parse(userInfor);
      this.userInfo = userInforJson;
      this.isUserLoggedIn = true;
      let jwt = userInforJson.jwt;
      const helper = new JwtHelperService();
     const decodedToken = helper.decodeToken(jwt);
     this.isAdmin = decodedToken.admin;
     this.isLecture = decodedToken.IsLecture;
    }
   }

   getUserInfo(){
     return this.userInfo;
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

   logout() {                            
   this.isUserLoggedIn = false;
   this.isAdmin = false;
   this.isLecture = false;
   this.userInfo = null;
   localStorage.removeItem('userInfo');
  this.router.navigateByUrl('/login');
 }
}
