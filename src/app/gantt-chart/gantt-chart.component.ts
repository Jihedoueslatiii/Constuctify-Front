import { Component, OnInit, Input } from '@angular/core';
import { Task } from 'src/app/Views/model/task.model';
import { TaskService } from 'src/app/Views/service/task.service';


// Use require syntax for CommonJS modules
const Gantt = require('frappe-gantt').default;
console.log('Gantt:', Gantt);
@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit {
  @Input() tasks: Task[] = [];
  private gantt: any;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.renderGanttChart();
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  renderGanttChart(): void {
    const ganttData = this.tasks.map(task => ({
      id: task.idTask.toString(), // Ensure ID is a string
      name: task.title,
      start: task.dueDate, // Use dueDate as the start date
      end: this.calculateEndDate(task.dueDate), // Calculate end date
      progress: this.calculateProgress(task.status), // Calculate progress
      dependencies: task.dependencies ? task.dependencies.map(d => d.toString()) : [], // Ensure dependencies are strings
    }));
  
    this.gantt = new Gantt('#gantt', ganttData, {
      header_height: 50,
      column_width: 30,
      step: 24,
      view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
      bar_height: 20,
      bar_corner_radius: 3,
      arrow_curve: 5,
      padding: 18,
      view_mode: 'Day',
      date_format: 'YYYY-MM-DD',
      custom_popup_html: null,
    });
  }
  calculateEndDate(startDate: string): string {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 7); // Example: 7 days duration
    return endDate.toISOString().split('T')[0];
  }

  calculateProgress(status: string): number {
    switch (status) {
      case 'COMPLETED':
        return 100;
      case 'IN_PROGRESS':
        return 50;
      default:
        return 0;
    }
  }
}