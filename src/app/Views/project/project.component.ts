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

  // Key metrics
  totalProjects: number = 0;
  completedProjects: number = 0;
  overdueProjects: number = 0;

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
      etatProjet: 'PLANIFIE'
    };
    this.isEditing = true;
  }

  saveProject(): void {
    if (!this.selectedProject) return;
  
    // Extract the numeric part of the ID (e.g., "PRJ_009" -> 9)
    const numericId = this.extractNumericId(this.selectedProject.idProjet);
  
    if (numericId === 0) {
      // For creating a new project
      this.projectService.createProject(this.selectedProject).subscribe({
        next: (newProject: Project) => {
          this.projects.push(newProject);
          this.resetForm();
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
    // Convert formatted ID (PRJ_003) to numeric ID (3)
    const numericId = typeof idProjet === 'string' ? parseInt(idProjet.replace('PRJ_', ''), 10) : idProjet;

    console.log('Deleting project with ID:', numericId, 'Type:', typeof numericId); // Debugging log

    this.projectService.deleteProject(numericId).subscribe({
      next: () => {
        this.projects = this.projects.filter(project => project.idProjet !== numericId);
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
}