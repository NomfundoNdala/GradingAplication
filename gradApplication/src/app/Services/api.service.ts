import { Injectable } from '@angular/core';
import { promise } from 'selenium-webdriver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse, ILoggedUserData } from '../Interfaces/Iauth';
var apiUrl: string = "";
var hearders: any = "";
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoiZTQxYWUwMmItNDg2YS00MDllLTk0NDYtZjBkNmNhMTE1Yzc4IiwiZXhwIjoxNjIwNTI0ODcwLCJJc0xlY3R1cmUiOnRydWV9.P7Aa0twdUilKo0IBPc5BTZ0qI6sdHh-sSm2AxnNnljM";
var LoggedUserData: ILoggedUserData = { jwt: token, name: '', stuffNumber: '', surname: '' };
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {
    apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";
    this.getLoggedUserData();
  }

  getLoggedUserData() {
    var userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      LoggedUserData = JSON.parse(userInfo);
    }
    hearders = new HttpHeaders().set(
      "Authorization", 'Bearer ' + LoggedUserData.jwt
    );
    return hearders;
  }

  login(username: string, password: string) {
    return this.httpClient.post<ApiResponse>(apiUrl + `/api/Login/login?username=${username}&password=${password}`, {});
  }
  getAllStudents() {
    console.log(hearders)
    return this.httpClient.get<ApiResponse>(apiUrl + '/api/Student/getAll', { headers: hearders });
  }
  getAllGroups() {
    return this.httpClient.get<ApiResponse>(apiUrl + '/api/Lecture/getAllGroups', { headers: hearders });
  }

  getStudent(studentNumber: string) {

    return this.httpClient.get<ApiResponse>(apiUrl + `/api/Student/getStudent?studentNumber=${studentNumber}`, { headers: hearders });
  }
}
