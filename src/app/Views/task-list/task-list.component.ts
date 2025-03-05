import { Component, OnInit } from '@angular/core';
import { Task } from 'src/app/Views/model/task.model';
import { TaskService } from 'src/app/Views/service/task.service';
import { ProjectService } from 'src/app/Views/service/project.service';
import { Project } from 'src/app/Views/model/project';
import { ActivatedRoute } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSnackBar } from '@angular/material/snack-bar';




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
  projects: Project[] = [];
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
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.currentProjectId = params['projectId'] ? Number(params['projectId']) : null;
      this.loadTasks();
    });
    this.loadProjects();
  }

  loadTasks(): void {
    if (this.currentProjectId) {
      this.taskService.getTasksByProject(this.currentProjectId).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.updateFilteredTasks();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    } else {
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.updateFilteredTasks();
        },
        error: (error) => {
          console.error('Error fetching tasks:', error);
        }
      });
    }
  }

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

  updateFilteredTasks(): void {
    this.notStartedTasks = this.getTasksByStatus('NOT_STARTED');
    this.inProgressTasks = this.getTasksByStatus('IN_PROGRESS');
    this.completedTasks = this.getTasksByStatus('COMPLETED');
  }

  getTasksByStatus(status: string): Task[] {
    return this.tasks.filter(task => task.status === status) || [];
  }

  getTaskCountByStatus(status: string): number {
    return this.getTasksByStatus(status).length;
  }

  openModal(isEdit: boolean, task?: Task): void {
    this.showModal = true;
    if (isEdit && task) {
      this.editingTask = { ...task };
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

  closeModal(): void {
    this.showModal = false;
    this.editingTask = null;
  }

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
          this.assignTaskToProject(createdTask.idTask, this.newTask.project.idProjet);
        }
        this.tasks.push(createdTask);
        
        this.updateFilteredTasks();
        this.closeModal();
      },
      error: (error) => {
        console.error('Error creating task:', error);
        this.closeModal();
      }
    });
  }

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
          this.updateFilteredTasks();
          this.closeModal();
        },
        error: (error) => {
          console.error('Error updating task:', error);
          this.closeModal();
        }
      });
    }
  }

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

  extractNumericId(formattedId: string): number {
    const numericPart = formattedId.match(/\d+/);
    return numericPart ? parseInt(numericPart[0], 10) : NaN;
  }

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
        this.updateFilteredTasks();
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    if (event.previousContainer === event.container) {
      // Same container - just reordering
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving between containers
      const item = event.previousContainer.data[event.previousIndex];
      
      // Update the task status based on the target container
      if (event.container.id === 'not-started-list') {
        item.status = 'NOT_STARTED';
      } else if (event.container.id === 'in-progress-list') {
        item.status = 'IN_PROGRESS';
      } else if (event.container.id === 'completed-list') {
        item.status = 'COMPLETED';
      }
      
      // Perform the array transfer
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Update the task in the backend
      this.taskService.updateTask(item).subscribe({
        next: (updatedTask) => {
          console.log('Task status updated:', updatedTask);
        },
        error: (error) => {
          console.error('Error updating task status:', error);
          // Revert the UI change if the API call fails
          this.updateFilteredTasks();
        }
      });
    }
  }
  // Calculate completion rate
  getCompletionRate(): number {
    if (this.tasks.length === 0) return 0;
    return Math.round((this.completedTasks.length / this.tasks.length) * 100);
  }

  // Count tasks by priority
  getTasksByPriority(priority: string): number {
    return this.tasks.filter(task => task.priority === priority).length;
  }

  // Count tasks by status
  getTasksByStatusCount(status: string): number {
    return this.tasks.filter(task => task.status === status).length;
  }

  // Get recent completions
  getRecentCompletions(): Task[] {
    return [...this.completedTasks]
      .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
      .slice(0, 3); // Get only the 3 most recent
  }

  // Get project completion stats
  getProjectCompletionStats(): { name: string, completionPercentage: number }[] {
    const projectStats: Map<string, { total: number, completed: number }> = new Map();
    
    this.tasks.forEach(task => {
      if (task.project) {
        const projectName = task.project.nomProjet;
        if (!projectStats.has(projectName)) {
          projectStats.set(projectName, { total: 0, completed: 0 });
        }
        
        const stats = projectStats.get(projectName);
        if (stats) {
          stats.total++;
          if (task.status === 'COMPLETED') {
            stats.completed++;
          }
        }
      }
    });
    
    const result: { name: string, completionPercentage: number }[] = [];
    projectStats.forEach((stats, projectName) => {
      const completionPercentage = stats.total > 0 
        ? Math.round((stats.completed / stats.total) * 100) 
        : 0;
      
      result.push({
        name: projectName,
        completionPercentage
      });
    });
    
    return result.sort((a, b) => b.completionPercentage - a.completionPercentage);
  }
 
 
}