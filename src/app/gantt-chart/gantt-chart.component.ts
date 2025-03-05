import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { Task } from 'src/app/Views/model/task.model';
import { TaskService } from 'src/app/Views/service/task.service';
import { gantt } from 'dhtmlx-gantt';

@Component({
  selector: 'app-gantt-chart',
  templateUrl: './gantt-chart.component.html',
  styleUrls: ['./gantt-chart.component.css']
})
export class GanttChartComponent implements OnInit, AfterViewInit {
  @Input() tasks: Task[] = [];
  ganttData: any[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  ngAfterViewInit(): void {
    if (this.tasks.length > 0) {
      setTimeout(() => {
        this.prepareGanttData();
        this.renderGanttChart();
      }, 100);
    }
  }

  loadTasks(): void {
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.prepareGanttData();
        setTimeout(() => {
          this.renderGanttChart();
        }, 100);
      },
      error: (error) => {
        console.error('Error fetching tasks:', error);
      }
    });
  }

  prepareGanttData(): void {
    if (!this.tasks || this.tasks.length === 0) {
      console.warn('No tasks available for Gantt preparation');
      this.ganttData = [];
      return;
    }

    try {
      this.ganttData = this.tasks.map(task => {
        if (!task) {
          console.warn('Found undefined task in tasks array');
          return null;
        }

        let startDate = new Date();
        if (task.dueDate) {
          try {
            startDate = new Date(task.dueDate);
            if (isNaN(startDate.getTime())) {
              console.warn('Invalid date format for task:', task.idTask);
              startDate = new Date();
            }
          } catch (e) {
            console.warn('Error parsing date for task:', task.idTask);
            startDate = new Date();
          }
        }

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        const formattedEndDate = endDate.toISOString().split('T')[0];

        return {
          id: task.idTask?.toString() || `task-${Math.random().toString(36).substr(2, 9)}`,
          text: task.title || 'Untitled Task',
          start_date: formattedStartDate,
          duration: 7,
          progress: this.calculateProgress(task.status || 'NOT_STARTED'),
          open: true
        };
      }).filter(task => task !== null);
    } catch (error) {
      console.error('Error preparing Gantt data:', error);
      this.ganttData = [];
    }
  }

  renderGanttChart(): void {
    console.log('Rendering Gantt chart...');

    const container = document.getElementById('gantt');
    if (!container) {
      console.error('Gantt container not found in the DOM!');
      return;
    }

    container.innerHTML = '';

    if (!this.ganttData || this.ganttData.length === 0) {
      console.warn('No tasks available for Gantt chart');
      container.innerHTML = '<div class="no-data-message">No tasks available to display.</div>';
      return;
    }

    try {
      gantt.init('gantt');

      gantt.config.date_format = '%Y-%m-%d';
      gantt.config['scale_unit'] = 'day';
      gantt.config['step'] = 1;
      gantt.config.min_column_width = 30;

      gantt.parse({ data: this.ganttData });

      console.log('Gantt chart successfully initialized!');
    } catch (error: any) {
      console.error('Error initializing Gantt chart:', error);
      container.innerHTML = `<div class="error-message">
        Error loading Gantt chart: ${error?.message || 'Unknown error'}
      </div>`;
    }
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

  // Add this method to handle view mode changes
  changeViewMode(mode: string): void {
    switch (mode) {
      case 'Day':
        gantt.config['scale_unit'] = 'day'; // Use bracket notation
        gantt.config['step'] = 1; // Use bracket notation
        break;
      case 'Week':
        gantt.config['scale_unit'] = 'week'; // Use bracket notation
        gantt.config['step'] = 1; // Use bracket notation
        break;
      case 'Month':
        gantt.config['scale_unit'] = 'month'; // Use bracket notation
        gantt.config['step'] = 1; // Use bracket notation
        break;
      default:
        console.warn('Unknown view mode:', mode);
        return;
    }
  
    gantt.render(); // Refresh the Gantt chart
  }
}