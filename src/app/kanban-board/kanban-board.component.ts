import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Project } from '../Views/model/project';
import { ProjectService } from '../Views/service/project.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  // Arrays to hold projects by status
  plannedProjects: Project[] = [];
  inProgressProjects: Project[] = [];
  completedProjects: Project[] = [];

  // WIP limits for columns
  wipLimits = {
    planned: 10,
    inProgress: 5,
    completed: 0 // No limit for completed
  };

  // Track whether columns are over their WIP limit
  isOverLimit = {
    planned: false,
    inProgress: false
  };

  constructor(
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (projects: Project[]) => {
        // Reset arrays
        this.plannedProjects = [];
        this.inProgressProjects = [];
        this.completedProjects = [];

        // Sort projects into appropriate arrays based on status
        projects.forEach(project => {
          switch (project.etatProjet) {
            case 'PLANIFIE':
              this.plannedProjects.push(project);
              break;
            case 'EN_COURS':
              this.inProgressProjects.push(project);
              break;
            case 'TERMINE':
              this.completedProjects.push(project);
              break;
          }
        });

        // Check WIP limits
        this.checkWipLimits();
      },
      error: (error) => console.error('Error loading projects for Kanban board:', error)
    });
  }

  checkWipLimits(): void {
    this.isOverLimit.planned = this.plannedProjects.length > this.wipLimits.planned;
    this.isOverLimit.inProgress = this.inProgressProjects.length > this.wipLimits.inProgress;
  }

  drop(event: CdkDragDrop<Project[]>): void {
    if (event.previousContainer === event.container) {
      // Reordering within the same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Moving to a different column
      const targetColumn = this.getColumnName(event.container.id);

      // Check if moving would exceed WIP limit
      if (targetColumn === 'inProgress' && event.container.data.length >= this.wipLimits.inProgress) {
        alert(`Cannot move project to In Progress. WIP limit (${this.wipLimits.inProgress}) would be exceeded.`);
        return;
      }

      // Get the project before transferring it
      const project = event.previousContainer.data[event.previousIndex];
      const newStatus = this.getStatusFromColumn(targetColumn);

      // Update the project object with new status
      project.etatProjet = newStatus;

      // Perform the move in the UI
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );

      // Extract the numeric ID correctly
      const numericId = this.extractNumericId(project.idProjet);

      // Update project in database
      this.projectService.updateProject(numericId, project)
        .subscribe({
          next: () => {
            console.log(`Project ${project.nomProjet} status updated to ${newStatus}`);
            // Recheck WIP limits after the update
            this.checkWipLimits();
          },
          error: (error) => {
            console.error('Error updating project status:', error);
            // Rollback the UI change if update fails
            this.loadProjects();
          }
        });
    }
  }

  getColumnName(containerId: string): string {
    switch (containerId) {
      case 'plannedList': return 'planned';
      case 'inProgressList': return 'inProgress';
      case 'completedList': return 'completed';
      default: return '';
    }
  }

  getStatusFromColumn(columnName: string): string {
    switch (columnName) {
      case 'planned': return 'PLANIFIE';
      case 'inProgress': return 'EN_COURS';
      case 'completed': return 'TERMINE';
      default: return '';
    }
  }

  extractNumericId(formattedId: string | number): number {
    if (typeof formattedId === 'number') {
      return formattedId;
    }
    const numericPart = formattedId.match(/\d+/);
    return numericPart ? parseInt(numericPart[0], 10) : 0;
  }

  // Methods to adjust WIP limits
  increaseWipLimit(column: 'planned' | 'inProgress'): void {
    this.wipLimits[column]++;
    this.checkWipLimits();
  }

  decreaseWipLimit(column: 'planned' | 'inProgress'): void {
    if (this.wipLimits[column] > 1) {
      this.wipLimits[column]--;
      this.checkWipLimits();
    }
  }

  // Navigate to project details
  viewProjectDetails(project: Project): void {
    this.router.navigate(['/projects'], {
      queryParams: { selectedProjectId: this.extractNumericId(project.idProjet) }
    });
  }

  viewProjectTasks(projectId: string | number): void {
    const numericId = this.extractNumericId(projectId);
    this.router.navigate(['/tasks'], {
      queryParams: { projectId: numericId }
    });
  }

  // Return to projects list
  goToProjects(): void {
    this.router.navigate(['/projects']);
  }
}