import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssigmentManagerComponent } from './assigment-manager.component';

describe('AssigmentManagerComponent', () => {
  let component: AssigmentManagerComponent;
  let fixture: ComponentFixture<AssigmentManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssigmentManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssigmentManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
