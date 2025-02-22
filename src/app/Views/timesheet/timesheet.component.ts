import { Component, OnInit } from '@angular/core';

import { TaskService } from '../service/task.service';
import { Task } from 'dhtmlx-gantt';
import { Timesheet } from '../model/Timesheet ';
import { TimesheetService } from '../service/TimesheetService .service';

@Component({
  selector: 'app-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.css']
})
export class TimesheetComponent implements OnInit {
  taskId: number = 1; // Example Task ID
  timesheet: Timesheet = {
    date: '', hoursWorked: 0, description: '',
    taskId: 0
  };

  constructor(private timesheetService: TimesheetService) { }

  ngOnInit(): void {
    // You can fetch task details here if needed
  }

  logTimesheet(): void {
    this.timesheetService.logTimesheet(this.taskId, this.timesheet).subscribe(
      response => {
        console.log('Timesheet logged:', response);
        alert('Timesheet logged successfully');
      },
      error => {
        console.error('Error logging timesheet:', error);
        alert('Error logging timesheet');
      }
    );
  }
}