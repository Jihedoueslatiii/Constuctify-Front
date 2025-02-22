import { Component, OnInit } from '@angular/core';
import 'dhtmlx-gantt';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit {
  ngOnInit(): void {
    console.log('GanttChartComponent ngOnInit called');

    // Ensure gantt is recognized
    if ((window as any).gantt) {
      const gantt = (window as any).gantt;
      gantt.init('gantt-container');
      gantt.parse({
        data: [
          { id: 1, text: "Task #1", start_date: "2023-04-01", duration: 3, progress: 0.6 },
          { id: 2, text: "Task #2", start_date: "2023-04-05", duration: 3, progress: 0.4 }
        ]
      });
    } else {
      console.error('Gantt library not loaded');
    }
  }
}
