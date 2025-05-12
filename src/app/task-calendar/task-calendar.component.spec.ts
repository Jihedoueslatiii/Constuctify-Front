import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCalendarComponent } from './task-calendar.component';

describe('TaskCalendarComponent', () => {
  let component: TaskCalendarComponent;
  let fixture: ComponentFixture<TaskCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskCalendarComponent]
    });
    fixture = TestBed.createComponent(TaskCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
