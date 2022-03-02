import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ApiResponse } from '../Interfaces/Iauth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = 'https://gradingsystem2022.azurewebsites.net';
  private isLecture: boolean = false;
  private isAdmin: boolean = false;
  private isUserLoggedIn: boolean = false;
  private userInfo: any = null;

  constructor(private router: Router, private httpClient: HttpClient) {}

  checkUserRights() {
    let userInfor = localStorage.getItem('userInfo');
    this.manageUserLoggedRights(userInfor ? userInfor : '');
  }
  manageUserLoggedRights(userInfor: string) {
    if (userInfor && userInfor != '') {
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

  getUserInfo() {
    return this.userInfo;
  }
  getIsAdmin() {
    return this.isAdmin;
  }

  getIsLecture() {
    return this.isLecture;
  }

  getIsUserLoggedIn() {
    return this.isUserLoggedIn;
  }

  //  login(username: string, password: string) {
  //   return this.httpClient.post<ApiResponse>(this.apiUrl + `/api/Login/login?username=${username}&password=${password}`, {});
  // }
  setUserLogged(userInfo: string) {
    localStorage.setItem('userInfo', userInfo);
    this.manageUserLoggedRights(userInfo);
    setInterval(() => {
      this.router.navigateByUrl('/home');
    }, 2000);
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
