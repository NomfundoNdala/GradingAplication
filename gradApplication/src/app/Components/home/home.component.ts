
import { Component, HostListener, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import { first } from 'rxjs/operators';
import { IGroup, IStudent } from 'src/app/Interfaces/Student';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';


const ELEMENT_DATA: IStudent[] = [];

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  isUserLoggedIn = false;
  error = '';
  success = ''
  loading = false;
  loadingStudents = false;
  foundNoStudent = true;
  dataFound = false;
  columnsToDisplay = ['groupName', 'groupId'];
  groupsAdded: IGroup[] = [];
  studentsInAGroup: any[] = [];
  dataSource = new MatTableDataSource(this.groupsAdded);
  expandedElement: IGroup = this.groupsAdded[0];
  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
      this.getGroups();

    } else {
      this.router.navigateByUrl('/login');
    }

  }
  clickedGroup(e: any) {
    this.studentsInAGroup = [];
    this.getGr(e.groupId);
  }

  GroupToMark(e: any) {
    console.log(e);
    this.router.navigateByUrl('group/' + e.groupId);
  }
  ViewStudent(student: any) {
    console.log(student);
    this.router.navigateByUrl('/editS/' + student.uniqueId)
  }
  ngOnInit(): void {
    this.loading = true;


  }
  getGroups() {
    this.apiService.getAllGroups().subscribe((res) => {
      let data = [];
      console.log(res.data);

      if (res.status) {
        data = res.data;
        data.map((d: IGroup, i: number) => {
          this.groupsAdded.push(d);
        })
      }
      this.dataFound = true;
      this.loading = false;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getGr(el: string) {
    console.log(el);
    this.studentsInAGroup = [];
    this.loadingStudents = true;
    this.apiService.getStudentInAGroup(el).subscribe((res: any) => {
      if (res.status) {
        if (res.data) {
          this.studentsInAGroup.push(res.data);
          console.log(this.studentsInAGroup)
          if (this.studentsInAGroup[0].length <= 0) {
            this.foundNoStudent = true;
          } else {
            this.foundNoStudent = false;
          }
        }
      }
      this.loadingStudents = false;
    })
  }
  editClick(data: IStudent) {
    console.log(data, 'on edit mode')
    alert("trying to edit " + data.name)
  }
  deleteClick(data: IStudent) {
    console.log(data, 'on delete mode')
    alert("trying to delete " + data.name)
  }
}
