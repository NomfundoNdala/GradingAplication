import { AuthService } from 'src/app/Services/auth.service';
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
  styleUrls: ['./student.component.scss'],
})
export class StudentComponent implements OnInit {
  isUserLoggedIn = false;
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  success = '';
  student!: IStudent;

  constructor(
    private studentService: StudentServiceService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) {
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      studentNumber: ['', Validators.required],
      groupName: ['', Validators.required],
    });

    this.student = {
      groupName: this.f.groupName.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      studentNumber: this.f.studentNumber.value,
      totalMark: '0',
    };

    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.registerForm.controls;
  }

  file: any;
  fileChanged(e: any) {
    this.file = e.target.files[0];
    console.log(this.file);
  }
  uploadDocument() {
    let fileReader = new FileReader();
    let c: any = '';
    fileReader.onload = (e) => {
      c = fileReader.result;
      var lines = c.split('\n');
      var columns = lines[0];
      var studentsData: IStudent[] = [];

      for (var line = 1; line < lines.length; line++) {
        var dataStudents = lines[line].split(' ,');
        console.log(lines[line]);
        studentsData.push({
          groupName: dataStudents[3],
          name: dataStudents[1],
          studentNumber: dataStudents[0],
          surname: dataStudents[2],
          totalMark: '0',
        });
      }
      console.log(studentsData);
    };
    fileReader.readAsText(this.file);
  }
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
    this.studentService.createStudent(this.student).subscribe(
      (data: any) => {
        console.log(data.message);
        console.log(data);
        if (data.status) {
          // this means we are saving in to local storage. why do you need to savw data after creating studennt ???
          //  localStorage.setItem('userInfo', JSON.stringify(data.data));

          //when you set success to a message , you need to stop the loading too meaning
          this.loading = false; //this stops the loading
          this.success = data.message;
          this.error = '';

          //why do you route back to home after a student has been registered ???
          this.router.navigateByUrl('/home');
        } else {
          this.error = data.message;
        }
        this.loading = false;
      },
      (error) => {
        this.error = error.message;
        this.success = '';
        this.loading = false;
      }
    );
  }
}
