import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UStudent, IStudent } from 'src/app/Interfaces/Student';
import { ApiService } from 'src/app/Services/api.service';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-edit-student',
  templateUrl: './edit-student.component.html',
  styleUrls: ['./edit-student.component.scss']
})
export class EditStudentComponent implements OnInit {
  isUserLoggedIn = false;
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  success = ''
  editStudent: UStudent ={
  groupname :'',
  name :'',
  studentNumber :'', 
  surname :'',
  totalMark :''
  };
  uniqueId!: string;

  recieveStudent :IStudent ={
  totalMark : '',
  groupName :'',
  name :'',
  studentNumber :'',
  surname :'',
  id :'',
  uniqueId :'' 
 }

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService
  ) { 
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
     
    }else{
      this.router.navigateByUrl('/login');
    }
  }

  ngOnInit(): void {
    const url = window.location.pathname;
        var id = url.substring(url.lastIndexOf('/') + 1);
        this.uniqueId = id;
        console.log('xxx', id);
        this.apiService.getStudentById(id).subscribe((data)=>{
          if (data.status) {
            this.recieveStudent =data.data;
          }
       console.log(this.recieveStudent);
       this.registerForm = this.formBuilder.group({
        name: [this.recieveStudent.name, Validators.required],
        surname: [this.recieveStudent.surname, Validators.required],
        studentNumber: [this.recieveStudent.studentNumber, Validators.required],
        groupName: [this.recieveStudent.groupName, Validators.required]
      });
  
  
        })
    this.registerForm = this.formBuilder.group({
      name: [this.recieveStudent.name, Validators.required],
      surname: [this.recieveStudent.surname, Validators.required],
      studentNumber: [this.recieveStudent.studentNumber, Validators.required],
      groupName: [this.recieveStudent.groupName, Validators.required]
    });

    this.editStudent = {
      groupname: this.f.groupName.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      studentNumber: this.f.studentNumber.value,
      totalMark: this.recieveStudent.totalMark
    }
  }
  get f() { return this.registerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    // this is the pass you are missing , here we are taking the values from the form and then putting them into a variable student , 
    //which is of type Istudent meaning in is an object. similar to how we pass it on swagger
    this.editStudent = {
      groupname: this.f.groupName.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      studentNumber: this.f.studentNumber.value,
      totalMark: '0',
    };

    this.loading = true;
    this.apiService.editStudent(this.uniqueId, this.editStudent).subscribe((data: any) => {
      console.log(data.message);
      console.log(data)
      if (data.status) {
        // this means we are saving in to local storage. why do you need to savw data after creating studennt ???
        //  localStorage.setItem('userInfo', JSON.stringify(data.data));

        //when you set success to a message , you need to stop the loading too meaning 
        this.loading = false;  //this stops the loading
        this.success = data.message;
        this.error = '';

        //why do you route back to home after a student has been registered ???
        //this.router.navigateByUrl('/home');


      } else {
        this.error = data.message;
      }
      this.loading = false;
    },
      error => {
        this.error = error.message;
        this.success = '';
        this.loading = false;
      });
  }

}


