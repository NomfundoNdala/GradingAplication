import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { submitAssigmentDTO, UAssigment } from '../Components/Assigment/Assigmnt1';
import { IStudent } from '../Interfaces/Student';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StudentServiceService {
  apiUrl = "https://gradingsystemapi20210307145917.azurewebsites.net";
  constructor(private httpClient: HttpClient, private apiService: ApiService) { }


  createStudent(student: IStudent) {
    return this.httpClient.post(this.apiUrl + '/api/Student/create', student, { headers: this.apiService.getLoggedUserData() });
  }

  submitAssigment(assigment: submitAssigmentDTO) {
    return this.httpClient.post(this.apiUrl + '/api/Student/MarkedAssigment', assigment, { headers: this.apiService.getLoggedUserData() });
  }

  updateAssignment(data:UAssigment){
    return this.httpClient.patch(this.apiUrl + '/api/Student/UpdateAssigment', data, { headers: this.apiService.getLoggedUserData() });
  }

  updateAssignmentStudent(data:UAssigment , uniqueId:string){
    return this.httpClient.patch(this.apiUrl + `/api/Student/UpdateAssigmentStudent?uniqueId=${uniqueId}`, data, { headers: this.apiService.getLoggedUserData() });
  }

}
