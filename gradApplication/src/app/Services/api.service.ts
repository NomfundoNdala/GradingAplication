import { Injectable } from '@angular/core';
import { promise } from 'selenium-webdriver';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../Interfaces/Iauth';
var apiUrl: string = "";
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) {
    apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";
  }
  login(username: string, password: string) {
    return this.httpClient.post<ApiResponse>(apiUrl + `/api/Login/login?username=${username}&password=${password}`, {});
  }
  getAllStudents() {
    return this.httpClient.get(apiUrl + '/api/Student/getAll');
  }
  getAllGroups() {
    return this.httpClient.get(apiUrl + '/api/Student/getAllGroups');
  }

  getStudent(studentNumber: string) {
    return this.httpClient.get(apiUrl + `/api/Student/getStudent?studentNumber=${studentNumber}`);
  }
}
