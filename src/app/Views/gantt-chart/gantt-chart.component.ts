import { Component, OnInit } from '@angular/core';
import { Project } from '../model/project';
import { ProjectService } from '../service/project.service';
import { TaskService } from '../service/task.service';
import { Task } from 'src/app/Views/model/task.model'; // A
// ssuming you have a Task model defined

declare let gantt: any;

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit {
  ngOnInit(): void {
    console.log('GanttChartComponent ngOnInit called'); // Should see this in console if component initializes
    gantt.init('gantt-container');
    gantt.parse({
      data: [
        {id: 1, text: "Task #1", start_date: "2023-04-01", duration: 3, progress: 0.6},
        {id: 2, text: "Task #2", start_date: "2023-04-05", duration: 3, progress: 0.4}
      ]
    });
  }
}