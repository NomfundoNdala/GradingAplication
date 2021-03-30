import { HttpClient, HttpEventType } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {
  submitAssigmentDTO,
  UAssigment,
} from '../Components/Assigment/Assigmnt1';
import { IStudent } from '../Interfaces/Student';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class StudentServiceService {
  // progress: number = 0;
  apiUrl = 'https://gradingsystemapi20210307145917.azurewebsites.net';
  constructor(private httpClient: HttpClient, private apiService: ApiService) {}
  

  createStudent(student: IStudent) {
    return this.httpClient.post(this.apiUrl + '/api/Student/create', student, {
      headers: this.apiService.getLoggedUserData(),
    });
  }

  submitAssigment(assigment: submitAssigmentDTO) {
    return this.httpClient.post(
      this.apiUrl + '/api/Student/MarkedAssigment',
      assigment,
      { headers: this.apiService.getLoggedUserData() }
    );
  }

  updateAssignment(data: UAssigment) {
    return this.httpClient.patch(
      this.apiUrl + '/api/Student/UpdateAssigment',
      data,
      { headers: this.apiService.getLoggedUserData() }
    );
  }

  updateAssignmentStudent(data: UAssigment, uniqueId: string) {
    return this.httpClient.patch(
      this.apiUrl + `/api/Student/UpdateAssigmentStudent?uniqueId=${uniqueId}`,
      data,
      { headers: this.apiService.getLoggedUserData() }
    );
  }

  createStudents(student: any[]  )
  {
    console.log("hhh", student);
    return this.httpClient.post(this.apiUrl + '/api/Student/createStudentList', student, { headers: this.apiService.getLoggedUserData()} )
  }
  




  

  // upload(formData: any) {
  //   return this.httpClient
  //     .post(`${this.apiUrl}/applications`, formData, {
  //       reportProgress: true,
  //       observe: 'events',
  //       //  headers: this.requestHeader()
  //     })
  //     .pipe(
  //       map((event: any) => {
  //         switch (event.type) {
  //           case HttpEventType.UploadProgress:
  //             this.progress = Math.round((100 * event.loaded) / event.total);
  //             return { status: 'progress', message: this.progress };
  //           case HttpEventType.Response:
  //             return event.body;
  //           default:
  //             return `Unhandled event: ${event.type}`;
  //         }
  //       })
  //     );
  // }
}
function student(arg0: string, student: any, IStudent: any, arg3: { headers: any; }) {
  throw new Error('Function not implemented.');
}

