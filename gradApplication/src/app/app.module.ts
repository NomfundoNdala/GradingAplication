import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './Components/home/home.component';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { StudentComponent } from './Components/student/student.component';
import { AssigmentManagerComponent } from './Components/Assigment/assigment-manager/assigment-manager.component';
import { LecturerComponent } from './Components/lecturer/lecturer.component';
import { NavBarComponent } from './Components/nav-bar/nav-bar.component';
import { GroupComponent } from './Components/group/group.component';
import { ReportsComponent } from './components/reports/reports.component';
import { EditStudentComponent } from './components/edit-student/edit-student.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
// import { GroupComponent } from './components/group/group.component';




const modules = [
  MatButtonModule,
  MatFormFieldModule,
  BrowserModule,
  AppRoutingModule,
  ReactiveFormsModule,
  HttpClientModule,
  MatTableModule,
  BrowserAnimationsModule,
  FormsModule,
  MatToolbarModule,
  MatListModule
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    StudentComponent,
    AssigmentManagerComponent,
    LecturerComponent,
    NavBarComponent,
    GroupComponent,
    ReportsComponent,
    EditStudentComponent,
    FooterComponent
  ],
  imports: [...modules],
  exports: [...modules],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
