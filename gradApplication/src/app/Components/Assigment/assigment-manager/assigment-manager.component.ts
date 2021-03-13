import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { StudentServiceService } from 'src/app/Services/student-service.service';
import { Assigment, dropDownTemplate, MainProperties, mainTitleContent, submitAssigmentDTO } from '../../Assigment/Assigmnt1'



const Assigment1: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 3,
      learnerMark: 0,
      commment: ''
    },
    description: 'ERD created (printed out). Field and table names conform to naming standards'
  },
  {
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'Database script created (printed out)'
  },
  {
    content: {
      totalMark: 3,
      learnerMark: 0,
      commment: ''
    },
    description: 'At least 3 related example tables are created and populated at least 5 records each as per ERD.'
  },{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'Relationships created as specified in ERD'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'Web server set up, client can connect over network using Internet explorer or other web browser.'
    },

{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'Database on different machine from web server'
    },

{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'Learner illustrates understanding of 3-tiered set-up.'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'All pages are combined into one web site application. Pages can be accessed via menu links.'
    },

{
      content: {
        totalMark: 7,
        learnerMark: 0,
        commment: ''
      },
      description: 'Web application built to list, insert, update and delete data on selected tables. All functionality correct. Every group member builds and demonstrates at least one page that can list and update (OR list and insert, or list and delete) database content. Different students for this evaluation must not use students build different pages – one page.'
    },
],
  total: 30,
  name: 'Assigment1',
  weight: 7
}

const Assigment2: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'Name of the system'
  },
  {
    content: {
      totalMark: 3,
      learnerMark: 0,
      commment: ''
    },
    description: 'Objective/Vision'
  },
  {
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'User of the system'
  },{
      content: {
        totalMark: 26,
        learnerMark: 0,
        commment: ''
      },
      description: 'Functional Requirements'
    },
{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'Non-Functional Requirements'
    },

{
      content: {
        totalMark: 1,
        learnerMark: 0,
        commment: ''
      },
      description: 'Optional Features'
    },

{
      content: {
        totalMark: 1,
        learnerMark: 0,
        commment: ''
      },
      description: 'Other Important Issues'
    },


],
  total: 36,
  name: 'Assigment2',
  weight: 10
}

const Assigment3: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 10,
      learnerMark: 0,
      commment: ''
    },
    description: 'ERD'
  },
  {
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'Menu structure. Business terminology, ease of use.'
  },

  {
    content: {
      totalMark: 5,
      learnerMark: 0,
      commment: ''
    },description: 'Pages created which support business functionality. Any missing functionality when compared to project proposal -1/2.'
  },
{
      content: {
        totalMark: 6,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 1'
    },
{
      content: {
        totalMark: 6,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 2'
    },

{
      content: {
        totalMark: 6,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 3'
    },

{
      content: {
        totalMark: 6,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 4'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Form design templates approved.'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },description: 'The system appears professional. Alignment of controls, business terminology on controls. Any wrong aspect here -2.'
    },
{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'Standardised look throughout site.'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Skins used to style controls.'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'Stylesheet used to style html elements'
    },
{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'Every page has a title. Any page without a title -1/2.'
    },
{
      content: {
        totalMark: 4,
        learnerMark: 0,
        commment: ''
      },
      description: 'Drop downs where applicable (all fk fields). -1 for each missing dropdown'
    },
{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'All controls display suitable business meaning. (e.g. be careful of displaying PKs in drop-down list) Each group member evaluated individually on his/her page(s)'
    },
{
      content: {
        totalMark: 8,
        learnerMark: 0,
        commment: ''
      },
      description: 'A range ofsuitable controls used for recording sets, enumerated types, lists, dates. 1 mark for each nontextbox, non-dropdownlist control to a maximum of 8.'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Correct values are recorded in database when values are recorded using non-textbox controls (e.g. radiogroups, calendars, drop-down lists, checkboxes.) (-2 for any incorrect value) Each group member evaluated individually on his/her page(s). If no non-textbox controls are, used learner gets 0.'
    },

{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'At least one databound image displayed'
    },
{
      content: {
        totalMark: 4,
        learnerMark: 0,
        commment: ''
      },
      description: 'At least two default values are supplied inside a FormView, DetailsView or GridView. These default values assist in simplifying data entry'
    },
{
      content: {
        totalMark: 20,
        learnerMark: 0,
        commment: ''
      },
      description: 'Each group member provides use case descriptions and diagrams with test cases and test data for his/her page for testing the system (Hard copy). The test cases are complete. Each missing test case -3.'
    },


],
  total: 135,
  name: 'Assigment3',
  weight: 13
}

const Assigment4: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 3,
      learnerMark: 0,
      commment: ''
    },
    description: 'Access is restricted according to loggednon user. Test forbanonymous users and restricted users and roles.'
  },
  {
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'New users can be created dynamically.'
  },

  {
    content: {
      totalMark: 3,
      learnerMark: 0,
      commment: ''
    },description: 'The user interface for creating new users is integrated with the business aspects. No duplicate data-entry (e.g. asking for username or email) is required'
  },
{
      content: {
        totalMark: 2,
        learnerMark: 0,
        commment: ''
      },
      description: 'New users are assigned to correct role'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'New user information is correctly recorded in DB'
    },

{
      content: {
        totalMark: 4,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page content is displayed according to logged on user. Check for PAGE 29 update/delete pages'
    },

{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Menu is adapted according to logged - on user using suitable method.'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'Default page is adapted according to logged -on user'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },description: 'Report templates were submitted and were approved'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'There is at least one summary report page, useful for management.'
    },
{
      content: {
        totalMark: 6,
        learnerMark: 0,
        commment: ''
      },
      description: 'The report is properly filtered according to business requirements.2 marks for each filter used per page (4) (e.g. dates). The report is also filtered according to the logged -on user where applicable (2).'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },
      description: 'The report filters use default values to simplify the filter selection, e.g. the filter shows beginning of current month Each student evaluated individually'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'The report is correct and complete. -1/2 for any missing field deemed important for business value. Check against template. 0 if the report content is incorrect in any respect. Every group member evaluated individually'
    },
{
      content: {
        totalMark: 4,
        learnerMark: 0,
        commment: ''
      },
      description: 'Each report can be exported to another format, e.g. PDF, CSV.'
    },
{
      content: {
        totalMark: 20,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page-level error-  handling for the four data-entry or update pages. 10 + for each individuals marks for his/her error handlig(multiplied by 2)'
    },
{
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 1'
    },
    {
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 2'
    },
    {
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 3'
    },
    {
      content: {
        totalMark: 5,
        learnerMark: 0,
        commment: ''
      },
      description: 'Page 4'
    },

],
  total: 80,
  name: 'Assigment4',
  weight: 13
}

const Assigment5: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 8,
      learnerMark: 0,
      commment: ''
    },
    description: 'The student demonstrates the use of external code or components to add functionality to the system.'
  },
  {
    content: {
      totalMark: 2,
      learnerMark: 0,
      commment: ''
    },
    description: 'The student provides useful links to external sites, including social network sites.'
  },

  {
    content: {
      totalMark: 10,
      learnerMark: 0,
      commment: ''
    },description: 'The site appears neat and professional. Alignment of controls, standardized appearance, ease of navigation and logical navigation are addressed (4). Enough suitable BUSINESS data is displayed (at least 10 records in each table). This is demonstrated, for example, by displaying enough data when a report is opened first (4). The group understands the business (2)'
  },
{
      content: {
        totalMark: 12,
        learnerMark: 0,
        commment: ''
      },
      description: 'The system is deployed on a web server and can be accessed from a remote client (6). The database is on a different machine from the web server (6).'
    },
{
      content: {
        totalMark: 12,
        learnerMark: 0,
        commment: ''
      },
      description: 'Security and authentication are correct in the 3 -tiered deployment. This includes creation of users (3) and displayingcontent (3) and menu (3) according to logged -on users. It also includes restriction of users on pages for which they are not authenticated(3)'
    },

{
      content: {
        totalMark: 24,
        learnerMark: 0,
        commment: ''
      },
      description: 'All DML operations have the correct result in the3 - tiered deployment. Check 4 main pages. Any page with any integrity error gets 0.'
    },

{
      content: {
        totalMark: 16,
        learnerMark: 0,
        commment: ''
      },
      description: 'Data integrity is ensured using defensive programming and database design. Any error not properly handled - 8 (page level). Error messages that are not descriptive or specific enough -5.'
    },
{
      content: {
        totalMark: 3,
        learnerMark: 0,
        commment: ''
      },description: 'Exception handling of exceptions at server level (4). Exception handling is done at the lowest possible level (6)  - if an error can be handled at the page level, it should not be handled by the server. Any unhandled exception -5.'
    },
{
      content: {
        totalMark: 12,
        learnerMark: 0,
        commment: ''
      },
      description: 'The reports contribute to the business functionality and are correct and properly and logically filtered and ordered. Check 4 main reports. Any report without suitable filter(s) gets 0. Refer to Assessment 4. Any error related to correctness of information results in 0 for the report. Any report missing critical business information gets 0. Refer to Assessment 4.'
    },
{
      content: {
        totalMark: 4,
        learnerMark: 0,
        commment: ''
      },
      description: 'All reports can be exported in alternative formats.'
    },
{
      content: {
        totalMark: 10,
        learnerMark: 0,
        commment: ''
      },
      description: 'The system isready for use. Either a 10 or 0 to be assigned.'
    },
{
      content: {
        totalMark: 10,
        learnerMark: 0,
        commment: ''
      },
      description: 'All documentation and softcopy is provided in a neat package: Hard copy: Fully attributed ERD, Project Proposal, Database scripts, security information such as roles users and passwords. Test cases. Installation/deployment instructions. Softcopy: Complete system on CD, including database script file -10 for any missing component/document.'
    },
{
      content: {
        totalMark: 10,
        learnerMark: 0,
        commment: ''
      },
      description: 'Bells and Whistles'
    },

],
  total: 135,
  name: 'Assigment5',
  weight: 13
}



const choosenTemplate: any[] = [Assigment1, Assigment2, Assigment3, Assigment4, Assigment5];
@Component({
  selector: 'app-assigment-manager',
  templateUrl: './assigment-manager.component.html',
  styleUrls: ['./assigment-manager.component.scss']
})
export class AssigmentManagerComponent implements OnInit {
  isUserLoggedIn = false;
  assigmentForm!: FormGroup;
  mainTitle!: FormArray;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  select: any;
  assigmentTemplate: dropDownTemplate[] =
  [{index: 0, name: 'Assigment1' },
  { index: 1, name: 'Assigment2' },
  { index: 2, name: 'Assigment3' },
  { index: 3, name: 'Assigment4' },
  { index: 4, name: 'Assigment5' }]

  //["Assigment1", "Assigment2", "Assigment3"];
  constructor(
    private formBuilder: FormBuilder, 
    private studentService: StudentServiceService,
     private authService: AuthService,
     private router: Router) {
      if (authService.getIsUserLoggedIn()) {
        this.isUserLoggedIn = true;
  }
}


  ngOnInit(): void {
    this.initializeForm(Assigment1);
  }

  onChooseAssigmentChange(item: any) {
    var asg = choosenTemplate[item];
    this.initializeForm(asg);
    console.log(asg)
  }

  initializeForm(data: Assigment) {
    const ad: any[] = [];
    this.createItem(data.mainTitle).forEach((dd: any) => {
      ad.push(this.formBuilder.group(dd))
    })
    this.assigmentForm = this.formBuilder.group({
      total: [data.total, Validators.required],
      name: [data.name, Validators.required],
      weight: [data.weight, Validators.required],
      mainTitle: this.formBuilder.array(ad)
    });
  }
  createItem(d: any) {
    const cont: any[] = [];
    d.forEach((el: MainProperties) => {
      cont.push({
        content: this.createContentGroup(el.content),
        description: [el.description, Validators.required]
      })
    });
    return cont;
  }
  createContentGroup(c: mainTitleContent): FormGroup {
    return this.formBuilder.group({
      totalMark: [c.totalMark, Validators.required],
      learnerMark: [c.learnerMark, Validators.required],
      comment: [c.commment, Validators.required],
    })
  }

  addItem(): void {
    this.mainTitle = this.assigmentForm.get('mainTitle') as FormArray;
    // this.mainTitle.push(this.createItem(this.mainTitle));
  }
  get f() { return this.assigmentForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.assigmentForm.invalid) {
      return;
    }
    var fullAssigmentMarked: submitAssigmentDTO = {
      data: this.assigmentForm.value,
      groupName: 'aliens'
    }
    console.log(fullAssigmentMarked);
    this.studentService.submitAssigment(fullAssigmentMarked).subscribe((res: any) => {
      console.log('response when submitting assigment', res);
      if (res.status) {
        this.loading = false;
        this.success = res.message;
        this.error = '';
      } else {
        this.error = res.message;
      }
    }, error => {
      this.error = error.message;
      this.success = '';
      this.loading = false;
    });
  }

}
