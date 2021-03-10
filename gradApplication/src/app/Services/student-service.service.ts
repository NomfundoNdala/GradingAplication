import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../Interfaces/Student';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";
  constructor(private httpClient: HttpClient,  private apiService: ApiService) { }


  createStudent(student : IStudent)
  {
    return this.httpClient.post(this.apiUrl + '/api/Student/create',student, {headers: this.apiService.getLoggedUserData()});
  }
}
