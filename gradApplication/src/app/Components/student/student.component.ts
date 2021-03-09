import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from 'src/app/Services/student-service.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  constructor(studentService: StudentServiceService) { }

  ngOnInit(): void {
  }

  newStudent(): void {{
    this
  }}

}
