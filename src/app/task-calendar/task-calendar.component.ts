import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TaskService } from '../Views/service/task.service';
import { Task } from '../Views/model/task.model';

@Component({
  selector: 'app-task-calendar',
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.css']
})
export class TaskCalendarComponent implements OnInit {
  tasks: Task[] = []; // Store original tasks
  calendarEvents: EventInput[] = []; // Store formatted events for the calendar

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    events: [],
    eventDrop: this.handleEventDrop.bind(this),
    eventClick: this.handleEventClick.bind(this),
    dateClick: this.handleDateClick.bind(this),
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.fetchTasks();
  }

  fetchTasks() {
    this.taskService.getAllTasks().subscribe((data: Task[]) => {
      this.tasks = data; // Store the original tasks
      this.calendarEvents = this.tasks.map(task => ({
        id: task.idTask.toString(), // Convert to string for FullCalendar
        title: `${task.title} (${task.status})`, // Show title + status
        start: task.dueDate, // Due date as event start
        backgroundColor: this.getPriorityColor(task.priority), // Color based on priority
        extendedProps: { 
          description: task.description, 
          project: task.project?.nomProjet || 'No Project'
        }
      }));

      // ✅ Assign calendarEvents to FullCalendar
      this.calendarOptions.events = [...this.calendarEvents];
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'red';
      case 'MEDIUM': return 'orange';
      case 'LOW': return 'green';
      default: return 'blue';
    }
  }

  handleEventDrop(event: any) {
    const task = this.tasks.find(t => t.idTask.toString() === event.event.id);
    if (task) {
      task.dueDate = event.event.startStr; // Update due date
      this.taskService.updateTask(task).subscribe(() => {
        console.log('Task updated:', task);
      });
    }
  }

  handleEventClick(event: any) {
    alert(`Task: ${event.event.title}\nDescription: ${event.event.extendedProps.description}\nProject: ${event.event.extendedProps.project}`);
  }

  handleDateClick(event: any) {
    const title = prompt('Enter Task Title');
    if (title) {
      const newTask: Task = { 
        idTask: Math.floor(Math.random() * 1000), 
        title, 
        description: 'New Task',
        dueDate: event.dateStr, 
        status: 'NOT_STARTED', 
        priority: 'MEDIUM',
        dependencies: [],
      };
      this.taskService.createTask(newTask).subscribe((createdTask) => {
        this.tasks.push(createdTask);
        this.calendarEvents.push({
          id: createdTask.idTask.toString(),
          title: `${createdTask.title} (${createdTask.status})`,
          start: createdTask.dueDate,
          backgroundColor: this.getPriorityColor(createdTask.priority),
          extendedProps: { description: createdTask.description, project: 'No Project' }
        });

        // ✅ Update FullCalendar events
        this.calendarOptions.events = [...this.calendarEvents];
      });
    }
  }
  
}
