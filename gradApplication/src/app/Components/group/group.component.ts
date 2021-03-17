import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { LecturerService } from 'src/app/Services/lecturer.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Group } from 'src/app/Interfaces/lecturer';


@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {
  groupForm!: FormGroup;
    loading = false;
    submitted = false;
    returnUrl!: string;
    error = '';
    success = ''
    group!: Group;
    isUserLoggedIn = false;
   
  constructor(
    private lecturerService : LecturerService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router, 
    private authService: AuthService

  ) { if (authService.getIsUserLoggedIn())
    {
   this.isUserLoggedIn = true;
 }
 else
 {
   this.router.navigateByUrl('/home');
 }
}

  ngOnInit(): void {
    this.groupForm = this.formBuilder.group({
      groupName: ['', Validators.required],
      groupId: [{value:this.newGuid() , disabled:true}, Validators.required],
    });

    this.group = {
      groupName:  this.f.groupName.value,
      groupId:  this.f.groupId.value,
    }
  }
  get f(){ return this.groupForm.controls; }

  newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.groupForm.invalid) {
      return;
    }  

this.group = {
      
      groupName: this.f.groupName.value,
      groupId: this.f.groupId.value,
    }

    // this is the pass you are missing , here we are taking the values from the form and then putting them into a variable student , 
    //which is of type Istudent meaning in is an object. similar to how we pass it on swagger
   
    this.loading = true;
    this.lecturerService.createGroup(this.group).subscribe((data: any) => {
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
        this.router.navigate(['/login']);
        
       

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
