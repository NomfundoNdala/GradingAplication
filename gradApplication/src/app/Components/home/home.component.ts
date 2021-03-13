import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import { first } from 'rxjs/operators';
import { IStudent } from 'src/app/Interfaces/Student';
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
  dataFound = false;
  columnsToDisplay = ['studentNumber', 'name', 'surname', 'groupName', 'totalMark'];
  groupNames = [];
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  expandedElement: IStudent = ELEMENT_DATA[0];
  constructor(private apiService: ApiService, private authService: AuthService,private router: Router) {
    if (authService.getIsUserLoggedIn()) {
      this.isUserLoggedIn = true;
    this.apiService.getAllStudents().pipe(first())
      .subscribe(
        data => {
          if (data.status) {
            this.dataSource = new MatTableDataSource(data.data);
            console.log(this.dataSource, 'data')
            this.success = data.message;
          } else {
            this.error = data.message;
          }
          this.dataFound = true;
          this.loading = false;
        },
        error => {
          this.error = error;
          this.loading = false;
        });
        apiService.getAllGroups().subscribe((data)=>{
          if(data.status){
           //loop through data.data to get item.groupName then groupName.push(item.groupName) xD:
          }
          console.log(data);
        })
      } else{
        this.router.navigateByUrl('/login');
      }
    }

  ngOnInit(): void {
    this.loading = true;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
