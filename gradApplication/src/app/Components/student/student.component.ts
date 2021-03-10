import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from 'src/app/Services/student-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IStudent } from 'src/app/Interfaces/Student';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  success = ''
  student!: IStudent;

 

  constructor(
    private studentService: StudentServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      studentNumber: ['', Validators.required],
      groupName: ['', Validators.required]
    });

    this.student = {
      groupName: this.f.groupName.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      studentNumber: this.f.studentNumber.value,
      totalMark: '0'
    }
    
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f(){ return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // this is the pass you are missing , here we are taking the values from the form and then putting them into a variable student , 
    //which is of type Istudent meaning in is an object. similar to how we pass it on swagger
    this.student = {
      groupName: this.f.groupName.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      studentNumber: this.f.studentNumber.value,
      totalMark: '0',
    };

    this.loading = true;
    this.studentService.createStudent(this.student).subscribe((data: any) => {
      console.log(data.message);
      if (data.status) {
        // this means we are saving in to local storage. why do you need to savw data after creating studennt ???
        //  localStorage.setItem('userInfo', JSON.stringify(data.data));

        //when you set success to a message , you need to stop the loading too meaning 
        //  this.loading = false;  this stops the loading
        this.success = data.message;
        this.error = '';

        //why do you route back to home after a student has been registered ???
        this.router.navigateByUrl('/home');
      } else {
        this.error = data.message;
      }
      this.loading = false;
    },
      error => {
        this.error = error;
        this.success = '';
        this.loading = false;
      });
  }


}
