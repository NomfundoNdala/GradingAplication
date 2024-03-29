import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AssigmentManagerComponent } from './Components/Assigment/assigment-manager/assigment-manager.component';
import { HomeComponent } from './Components/home/home.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { StudentComponent } from './Components/student/student.component';
import { LecturerComponent } from './Components/lecturer/lecturer.component';
import { GroupComponent } from './Components/group/group.component';
import { ReportsComponent } from './Components/reports/reports.component';
import { StudentEditComponent } from './Components/student-edit/student-edit.component';





const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'student', component: StudentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'lecturer', component: LecturerComponent },
  { path: 'group', component: GroupComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'editS/:id', component: StudentEditComponent },
  { path: 'assignment', component: AssigmentManagerComponent },
  { path: 'group/:id', component: AssigmentManagerComponent }];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
