import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/Views/service/project.service';
import { Project } from 'src/app/Views/model/project';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isEditing: boolean = false;

  public chart: any;
  // Add this to your component class properties
Math: any = Math;

  // Key metrics
  totalProjects: number = 0;
  completedProjects: number = 0;
  overdueProjects: number = 0;
  filterStatus: string = '';
  filterStartDate: string = '';
  filterEndDate: string = '';
  filteredProjects: Project[] = [];
  p: number = 1;

  constructor(private projectService: ProjectService, private router: Router) {Chart.register(...registerables)}

  ngOnInit(): void {
    this.loadProjects();
  }
  calculateMetrics(): void {
    this.totalProjects = this.projects.length;
    this.completedProjects = this.projects.filter(p => p.etatProjet === 'TERMINE').length;
    this.overdueProjects = this.projects.filter(p => {
      const endDate = new Date(p.dateFin);
      const today = new Date();
      return p.etatProjet !== 'TERMINE' && endDate < today;
    }).length;
  }

  createChart(): void {
    const planned = this.projects.filter(p => p.etatProjet === 'PLANIFIE').length;
    const inProgress = this.projects.filter(p => p.etatProjet === 'EN_COURS').length;
    const completed = this.projects.filter(p => p.etatProjet === 'TERMINE').length;

    this.chart = new Chart('MyChart', {
      type: 'pie', // Pie chart
      data: {
        labels: ['Planned', 'In Progress', 'Completed'],
        datasets: [{
          label: 'Project Status',
          data: [planned, inProgress, completed],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'] // Colors for each segment
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.calculateMetrics();
        this.filteredProjects = [...this.projects]; // Ensure all projects are displayed initially

        this.createChart();
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }


  selectProject(project: Project): void {
    this.selectedProject = { ...project };
    this.isEditing = true;
  }

  createProject(): void {
    this.selectedProject = { 
      idProjet: 0, 
      nomProjet: '', 
      descriptionProjet: '', 
      dateDebut: '', 
      dateFin: '', 
      etatProjet: 'PLANIFIE',
      updatedAt: new Date() // Add the missing updatedAt property
    };
    this.isEditing = true;
  }
  saveProject(): void {
    if (!this.selectedProject) {
      alert('No project selected.');
      return;
    }
  
    // Validate required fields
    if (!this.selectedProject.nomProjet || this.selectedProject.nomProjet.trim() === '') {
      alert('Project name is required.');
      return;
    }
  
    if (!this.selectedProject.descriptionProjet || this.selectedProject.descriptionProjet.trim() === '') {
      alert('Project description is required.');
      return;
    }
  
    if (!this.selectedProject.dateDebut) {
      alert('Start date is required.');
      return;
    }
  
    if (!this.selectedProject.dateFin) {
      alert('End date is required.');
      return;
    }
  
    // Check if the end date is after the start date
    const startDate = new Date(this.selectedProject.dateDebut);
    const endDate = new Date(this.selectedProject.dateFin);
  
    if (endDate <= startDate) {
      alert('The end date must be later than the start date.');
      return;
    }
  
    // Extract the numeric part of the ID (e.g., "PRJ_009" -> 9)
    const numericId = this.extractNumericId(this.selectedProject.idProjet);
  
    // Set the updatedAt field to the current timestamp
    this.selectedProject.updatedAt = new Date();
  
    if (numericId === 0) {
      // For creating a new project
      this.projectService.createProject(this.selectedProject).subscribe({
        next: (newProject: Project) => {
          this.projects.push(newProject);
          this.resetForm();
          alert('Project created successfully!');
        },
        error: (error) => {
          console.error('Error creating project:', error);
          alert('Failed to create project');
        }
      });
    } else {
      // For updating the project
      this.projectService.updateProject(numericId, this.selectedProject).subscribe({
        next: (updatedProject: Project) => {
          const index = this.projects.findIndex(p => p.idProjet === numericId);
          if (index !== -1) this.projects[index] = updatedProject;
          this.resetForm();
          alert('Project updated successfully!');
        },
        error: (error) => {
          console.error('Error updating project:', error);
          alert('Failed to update project');
        }
      });
    }
  }
  
  
  // Helper function to extract the numeric part of the ID
  extractNumericId(formattedId: string | number): number {
    if (typeof formattedId === 'number') {
      return formattedId; // Already a number
    }
    const numericPart = formattedId.match(/\d+/); // Extract digits
    return numericPart ? parseInt(numericPart[0], 10) : 0; // Convert to number or return 0
  }

  cancelEdit(): void {
    this.resetForm();
  }

  deleteProject(idProjet: string | number): void {
    const confirmDeletion = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDeletion) return;
  
    const numericId = typeof idProjet === 'string' ? parseInt(idProjet.replace('PRJ_', ''), 10) : idProjet;
    this.projectService.deleteProject(numericId).subscribe({
      next: () => {
        this.projects = this.projects.filter(project => project.idProjet !== numericId);
        this.loadProjects();
      },
      error: (error) => {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    });
  }
  

  private resetForm(): void {
    this.isEditing = false;
    this.selectedProject = null;
  }

  viewProjectTasks(projectId: number): void {
    this.router.navigate(['/tasks'], { 
      queryParams: { projectId: projectId }
    });
  }
  applyFilters(): void {
    if (!this.filterStatus && !this.filterStartDate && !this.filterEndDate) {
      // Show all projects if no filters are selected
      this.filteredProjects = [...this.projects];
      return;
    }

    this.filteredProjects = this.projects.filter(project => {
      const matchesStatus = !this.filterStatus || project.etatProjet === this.filterStatus;
      const matchesStartDate = !this.filterStartDate || project.dateDebut >= this.filterStartDate;
      const matchesEndDate = !this.filterEndDate || project.dateFin <= this.filterEndDate;
      return matchesStatus && matchesStartDate && matchesEndDate;
    });
  }
    // Double-check how you're calling the method
    assignTaskToProject(projectId: number, taskId: number) {
      console.log('Attempting to assign task:', { projectId, taskId });
  
      this.projectService.assignTaskToProject(projectId, taskId)
        .subscribe({
          next: (response) => {
            console.log('Task assigned successfully', response);
            // Handle success (e.g., show a notification or refresh the task list)
          },
          error: (error) => {
            console.error('Complete error object:', error);
            console.error('Error status:', error.status);
            console.error('Error message:', error.message);
            console.error('Error body:', error.error);
            
            // More detailed error handling
            let errorMessage = 'Failed to assign task to project.';
            if (error.status === 0) {
              errorMessage += ' Network error. Check your connection.';
            } else if (error.status === 404) {
              errorMessage += ' Project or task not found.';
            } else if (error.status === 409) {
              errorMessage += ' Task is already assigned to another project.';
            } else if (error.status === 500) {
              errorMessage += ' Server error. Please try again later.';
            }
            
            alert(errorMessage);
          }
        });
    }
    getPaginatedProjects(): Project[] {
      const startIndex = (this.p - 1) * 6; // 6 projects per page
      const endIndex = startIndex + 6;
      return this.filteredProjects.slice(startIndex, endIndex);
    }
    nextPage(): void {
      if (this.p * 6 < this.filteredProjects.length) {
        this.p++;
      }
    }
    // Add this method to your component class
getTotalPages(): number {
  return Math.ceil(this.filteredProjects.length / 6);
}
    
}