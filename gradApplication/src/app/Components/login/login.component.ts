
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { ApiService } from 'src/app/Services/api.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/Services/auth.service';
import { validateStrongPassowrd, validStudentNumber } from 'src/app/Helper';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  isUserLoggedIn = false;
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  returnUrl!: string;
  error = '';
  success = '';
  ValidStufNumberMessage = 'Not a valid Stuff number';
  ValidPasswordMessage = 'Not a strong password';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService

  ) {
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
      this.router.navigateByUrl('/home')
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    if (validateStrongPassowrd(this.f.password.value)) {
      this.ValidPasswordMessage = '';
    }

    if (validStudentNumber(this.f.username.value)) {
      this.ValidStufNumberMessage = '';
    }
    if (this.ValidPasswordMessage != '' && this.ValidStufNumberMessage != '') {
      this.loading = true;
      this.apiService.login(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(
          data => {
            if (data.status) {
              this.authService.setUserLogged(JSON.stringify(data.data));
              this.success = data.message;
              this.error = '';;
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

    } else {
      this.error = 'Please fill the form with the right format details';
    }
  }

}
