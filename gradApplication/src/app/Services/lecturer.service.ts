import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group, ILecturer } from '../Interfaces/lecturer';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LecturerService {
  apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";


  constructor(private httpClient: HttpClient, private apiService: ApiService) { }

  createLecturer(lecturer: ILecturer) {
    return this.httpClient.post(this.apiUrl + '/api/Lecture/create', lecturer, { headers: this.apiService.getLoggedUserData() });
  }

  createGroup(group :Group) {
    return this.httpClient.post(this.apiUrl + '/api/Lecture/CreateGroup', group, { headers: this.apiService.getLoggedUserData() });
  }
  
  
}
