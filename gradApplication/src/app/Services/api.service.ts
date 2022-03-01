import { Injectable } from '@angular/core';
import { promise } from 'selenium-webdriver';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResponse, ILoggedUserData } from '../Interfaces/Iauth';
import { UStudent } from '../Interfaces/Student';
var apiUrl: string = '';
var hearders: any = '';
const token =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhIjoiZTQxYWUwMmItNDg2YS00MDllLTk0NDYtZjBkNmNhMTE1Yzc4IiwiZXhwIjoxNjIwNTI0ODcwLCJJc0xlY3R1cmUiOnRydWV9.P7Aa0twdUilKo0IBPc5BTZ0qI6sdHh-sSm2AxnNnljM';
var LoggedUserData: ILoggedUserData = {
  jwt: token,
  name: '',
  stuffNumber: '',
  surname: '',
};
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  studEdit!: UStudent;
  constructor(private httpClient: HttpClient) {
    apiUrl = 'https://gradingsystem2022.azurewebsites.net';
    // apiUrl = 'https://localhost:5001';
    this.getLoggedUserData();
  }

  getLoggedUserData() {
    var userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      LoggedUserData = JSON.parse(userInfo);
    }
    hearders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + LoggedUserData.jwt)
      .set('Content-Type', 'application/json');

    return hearders;
  }

  login(username: string, password: string) {
    return this.httpClient.post<ApiResponse>(
      apiUrl + `/api/Login/login?username=${username}&password=${password}`,
      {}
    );
  }
  getAllStudents() {
    console.log(hearders);
    return this.httpClient.get<ApiResponse>(apiUrl + '/api/Student/getAll', {
      headers: hearders,
    });
  }
  getAllGroups() {
    return this.httpClient.get<ApiResponse>(
      apiUrl + '/api/Lecture/getAllGroups',
      { headers: hearders }
    );
  }

  getStudent(studentNumber: string) {
    return this.httpClient.get<ApiResponse>(
      apiUrl + `/api/Student/getStudent?studentNumber=${studentNumber}`,
      { headers: hearders }
    );
  }

  // /api/Student/getStudentInAGroup?groupName=ggh

  getStudentInAGroup(groupId: string) {
    return this.httpClient.get<ApiResponse>(
      apiUrl + `/api/Student/getStudentInAGroup?groupId=${groupId}`,
      { headers: hearders }
    );
  }

  getGroup(groupId: string) {
    return this.httpClient.get<ApiResponse>(
      apiUrl + `/api/Student/getGroup?groupId=${groupId}`,
      { headers: hearders }
    );
  }
  getStudentById(uniqueId: string) {
    return this.httpClient.get<ApiResponse>(
      apiUrl + `/api/Student/getStudentUniqueId?uniqueId=${uniqueId}`,
      { headers: hearders }
    );
  }

  editStudent(uniqueId: string, studEdit: UStudent) {
    return this.httpClient.patch<ApiResponse>(
      apiUrl + `/api/Student/updateStudent?uniqueId=${uniqueId}`,
      studEdit,
      { headers: hearders }
    );
  }

  deleteStudent(uniqueId: string) {
    return this.httpClient.delete<ApiResponse>(
      apiUrl + `/api/Student/deleteStudentUniqueId?uniqueId=${uniqueId}`,
      { headers: hearders }
    );
  }
}
