import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentServiceService } from 'src/app/Services/student-service.service';
import { Assigment, dropDownTemplate, MainProperties, mainTitleContent, submitAssigmentDTO } from '../../Assigment/Assigmnt1'

const tempAssigment: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 10,
      learnerMark: 0,
      commment: 'ui improvement'
    },
    description: '1 OpenSource database'
  },
  {
    content: {
      totalMark: 70,
      learnerMark: 12,
      commment: 'none'
    },
    description: '2 OpenSource code'
  },
  {
    content: {
      totalMark: 70,
      learnerMark: 12,
      commment: 'none'
    },
    description: '3 OpenSource code'
  }],
  total: 0,
  name: 'Assigment1',
  weight: 7
}

const tempAssigment2: Assigment = {
  mainTitle: [{
    content: {
      totalMark: 0,
      learnerMark: 0,
      commment: 'scaling problem'
    },
    description: ' database invalid'
  },
  {
    content: {
      totalMark: 70,
      learnerMark: 12,
      commment: 'none'
    },
    description: 'code not readable'
  },
  {
    content: {
      totalMark: 70,
      learnerMark: 12,
      commment: 'none'
    },
    description: 'copied code'
  }],
  total: 0,
  name: 'Assigment2',
  weight: 50
}
const choosenTemplate: any[] = [tempAssigment, tempAssigment2, tempAssigment];
@Component({
  selector: 'app-assigment-manager',
  templateUrl: './assigment-manager.component.html',
  styleUrls: ['./assigment-manager.component.scss']
})
export class AssigmentManagerComponent implements OnInit {

  assigmentForm!: FormGroup;
  mainTitle!: FormArray;
  loading = false;
  submitted = false;
  error = '';
  success = '';
  select: any;
  assigmentTemplate: dropDownTemplate[] = [{ index: 0, name: 'Assigment1' },
  { index: 1, name: 'Assigment2' },
  { index: 2, name: 'Assigment3' }]

  //["Assigment1", "Assigment2", "Assigment3"];
  constructor(private formBuilder: FormBuilder, private studentService: StudentServiceService) {

  }

  ngOnInit(): void {
    this.initializeForm(tempAssigment);
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
