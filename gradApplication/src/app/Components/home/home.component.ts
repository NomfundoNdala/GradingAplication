
import { Component, HostListener, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/Services/api.service';
import { first } from 'rxjs/operators';
import { IGroup, IStudent } from 'src/app/Interfaces/Student';
import { AuthService } from 'src/app/Services/auth.service';
import { Router } from '@angular/router';
import { ConvertToCSV } from 'src/app/Helper';
import { FormBuilder, FormGroup } from '@angular/forms';


const ELEMENT_DATA: IStudent[] = [];

interface IgroupCsv {
  name: string,
  surname: string,
  studentNumber: string,
  totalMark: string,
  groupName: string
}
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
  jsonData: IgroupCsv[] = [];


  contactForm!: FormGroup;

  fileExtensions = [
    { name: "CSV", value: ".csv" },
    { name: "text file", value: ".txt" },
    { name: "json file", value: ".json" }
  ];
  constructor(private apiService: ApiService, private fb: FormBuilder, private authService: AuthService, private router: Router) {
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

  downloadFile(ext: string) {
    let csvData = ConvertToCSV(this.jsonData, ['name', 'surname', 'studentNumber', 'totalMark', 'groupName']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", "Group" + this.jsonData[0].groupName + ext);
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
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
    this.contactForm = this.fb.group({
      country: [null]
    })
  }

  deleteGroup() {

  }
  
  onChangeExtensions(val: any) {
    var firstLine = val.value.split('.')[1];
    this.downloadFile('.' + firstLine);
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
    this.jsonData = [];
    this.loadingStudents = true;
    this.apiService.getStudentInAGroup(el).subscribe((res: any) => {
      if (res.status) {
        if (res.data) {
          this.studentsInAGroup.push(res.data);
          this.studentsInAGroup[0].map((s: any, i: number) => {
            var c: IgroupCsv = {
              groupName: s.groupName,
              name: s.name,
              studentNumber: s.studentNumber,
              surname: s.surname,
              totalMark: s.totalMark
            }
            this.jsonData.push(c);
          })
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
