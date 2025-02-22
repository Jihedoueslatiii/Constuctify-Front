import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Task } from 'src/app/Views/model/task.model';
import { TaskService } from 'src/app/Views/service/task.service';
import { ProjectService } from 'src/app/Views/service/project.service';
import { Project } from 'src/app/Views/model/project';
import { ActivatedRoute } from '@angular/router';



@Pipe({
  name: 'filterByStatus'
})
export class FilterByStatusPipe implements PipeTransform {
  transform(tasks: Task[], status: string): Task[] {
    if (!tasks) return [];
    return tasks.filter(task => task.status === status);
  }
}
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  notStartedTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  completedTasks: Task[] = [];
  projects: Project[] = []; // List of projects for the dropdown
  newTask: Task = { 
    idTask: 0, 
    title: '', 
    description: '', 
    dueDate: '', 
    status: 'NOT_STARTED', 
    priority: 'LOW', 
    project: undefined 
  };
  showModal = false;
  editingTask: Task | null = null;
  currentProjectId: number | null = null;


  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private route: ActivatedRoute  // Add this

  ) {}

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(t => t.status === status);
  }

  getTaskCountByStatus(status: string): number {
    return this.getTasksByStatus(status).length;
  }

  ngOnInit(): void {
    // Subscribe to query params to get project ID
    this.route.queryParams.subscribe(params => {
      this.currentProjectId = params['projectId'] ? Number(params['projectId']) : null;
      this.loadTasks();
    });
    this.loadProjects();
  }

  // Load all tasks
  loadTasks(): void {
    if (this.currentProjectId) {
      // If you have an endpoint to get tasks by project:
      this.taskService.getTasksByProject(this.currentProjectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    } else {
      // Load all tasks if no project selected
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    }
    
  }

  // Load all projects
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error fetching projects:', error);
      }
    });
  }

  // Open modal for adding/editing a task
  openModal(isEdit: boolean, task?: Task): void {
    this.showModal = true;
    if (isEdit && task) {
      this.editingTask = { ...task }; // Clone the task for editing
      this.newTask = this.editingTask;
    } else {
      this.editingTask = null;
      this.newTask = { 
        idTask: 0, 
        title: '', 
        description: '', 
        dueDate: '', 
        status: 'NOT_STARTED', 
        priority: 'LOW', 
        project: undefined 
      };
    }
  }

  // Close the modal
  closeModal(): void {
    this.showModal = false;
    this.editingTask = null;
  }

  // Save or update a task
  saveTask(): void {
    if (this.editingTask) {
      this.updateTask(this.editingTask);
    } else {
      this.createTask();
    }
  }

  createTask(): void {
    this.taskService.createTask(this.newTask).subscribe({
      next: (createdTask) => {
        if (this.newTask.project) {
          // Note the order: project ID first, then task ID
          this.assignTaskToProject(createdTask.idTask, this.newTask.project.idProjet);
        }
        this.tasks.push(createdTask);
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.closeModal();
      }
    });
  }
  
  
  // Update an existing task
  updateTask(task: Task): void {
    if (this.editingTask) {
      this.taskService.updateTask(task).subscribe({
        next: (updatedTask) => {
          if (this.newTask.project) {
            this.assignTaskToProject(updatedTask.idTask, this.newTask.project.idProjet);
          }
          const index = this.tasks.findIndex(task => task.idTask === updatedTask.idTask);
          if (index !== -1) {
            this.tasks[index] = updatedTask;
          }
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.closeModal();
        }
      });
    }
  }

 // In task-list.component.ts
 assignTaskToProject(taskId: number | string, projectId: number | string): void {
  const numericTaskId = typeof taskId === 'string' ? this.extractNumericId(taskId) : taskId;
  const numericProjectId = typeof projectId === 'string' ? this.extractNumericId(projectId) : projectId;

  if (isNaN(numericTaskId) || isNaN(numericProjectId)) {
    console.error('Invalid task or project ID');
    alert('Invalid task or project ID');
    return;
  }

  this.taskService.assignTaskToProject(numericProjectId, numericTaskId).subscribe({
    next: (response) => {
      this.loadTasks();
      alert('Task successfully assigned to the project.');
    },
    error: (error) => {
      console.error('Error assigning task to project:', error);
      if (error.status === 404) {
        alert('Project or task not found.');
      } else if (error.status === 409) {
        alert('Task is already assigned to another project.');
      } else {
        alert('Failed to assign task to project. Please try again.');
      }
    }
  });
}

  
  // Helper function to extract numeric ID from formatted ID (e.g., "PRJ_013" -> 13)
  extractNumericId(formattedId: string): number {
    const numericPart = formattedId.match(/\d+/); // Extract numeric part using regex
    return numericPart ? parseInt(numericPart[0], 10) : NaN;
  }

  // Delete a task
  deleteTask(id: string | number): void {
    let numericId: number;

    if (typeof id === 'string') {
      const numericPart = (id as string).match(/\d+/);
      if (numericPart) {
        numericId = parseInt(numericPart[0], 10);
      } else {
        console.error('No numeric part found in ID:', id);
        alert('Invalid task ID format');
        return;
      }
    } else {
      numericId = id;
    }

    this.taskService.deleteTask(numericId).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(task => task.idTask !== numericId);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    });
  }
}