
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/Services/api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LecturerService } from 'src/app/Services/lecturer.service';
import { ILecturer } from 'src/app/Interfaces/lecturer';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-lecturer',
  templateUrl: './lecturer.component.html',
  styleUrls: ['./lecturer.component.scss']
})
export class LecturerComponent implements OnInit {
    registerLecturerForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    error = '';
    success = ''
    lecturer!: ILecturer;
    isUserLoggedIn = false;
    isAdmin = false;
 
  constructor(
    private lecturerService : LecturerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService, 
    private authService: AuthService
  ) {
    if (authService.getIsUserLoggedIn() && authService.getIsAdmin())
     {
    this.isUserLoggedIn = true; 
    this.isAdmin = true
  }
  else
  {
    this.router.navigateByUrl('/home');
  }
}


  ngOnInit(): void {
    this.registerLecturerForm = this.formBuilder.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      stuffNumber: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.lecturer = {
      password: this.f.password.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      stuffNumber: this.f.stuffNumber.value,
      email: this.f.email.value
    }

  }
  get f(){ return this.registerLecturerForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerLecturerForm.invalid) {
      return;
    }
this.lecturer = {
      password: this.f.password.value,
      name: this.f.name.value,
      surname: this.f.surname.value,
      stuffNumber: this.f.stuffNumber.value,
      email: this.f.email.value
    }

    // this is the pass you are missing , here we are taking the values from the form and then putting them into a variable student , 
    //which is of type Istudent meaning in is an object. similar to how we pass it on swagger
   
    this.loading = true;
    this.lecturerService.createLecturer(this.lecturer).subscribe((data: any) => {
      console.log(data.message);
      this.error = data.message;
      //console.log(data)
      if (data.status) {
        // this means we are saving in to local storage. why do you need to savw data after creating studennt ???
        //localStorage.setItem('userInfo', JSON.stringify(data.data));

        //when you set success to a message , you need to stop the loading too meaning 
        this.loading = false;  //this stops the loading
        this.success = data.message;
        this.error = '';

        //why do you route back to home after a student has been registered ???
        this.router.navigateByUrl('/login');
        
       

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







