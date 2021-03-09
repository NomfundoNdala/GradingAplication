import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IStudent } from '../Interfaces/Student';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";
  constructor(private httpClient: HttpClient) { }


  createStudent(student : IStudent)
  {
    this.httpClient.post(this.apiUrl, student);
  }
}
