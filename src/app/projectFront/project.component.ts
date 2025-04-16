import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/project.service';
import { Project } from 'src/app/project';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects: Project[] = [];
  selectedProject: Project | null = null;
  isEditing: boolean = false;
  private _snackBar: any;
  showSuccessCard: boolean = false; 

    

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }
  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => this.projects = data,
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
  
    if (this.selectedProject.idProjet === 0) {
      // For creating a new project
      this.projectService.createProject(this.selectedProject).subscribe({
        next: (newProject: Project) => {
          this.projects.push(newProject);
          this.resetForm();
          this.addNotification();
        },
        error: (error) => {
          console.error('Error creating project:', error);
          alert('Failed to create project');
        }
      });
    } else {
      // For updating the project
      this.projectService.updateProject(this.selectedProject.idProjet, this.selectedProject).subscribe({
        next: (updatedProject: Project) => {
          const index = this.projects.findIndex(p => p.idProjet === updatedProject.idProjet);
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
  addNotification(): void {
    this._snackBar.open('Thanks for the trust, dear client. We will contact you later.', 'Close', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });

    // Show success card after notification
    this.showSuccessCard = true;

    // Hide success card after a few seconds
    setTimeout(() => {
      this.showSuccessCard = false;
    }, 5000);
  }
  showToast(message: string, type: 'success' | 'error'): void {
    this._snackBar.open(message, 'Close', {
      duration: 3000, // Display for 3 seconds
      horizontalPosition: 'right', // Position the toast on the right
      verticalPosition: 'top', // Position the toast at the top
      panelClass: type === 'success' ? 'success-toast' : 'error-toast' // Add custom class based on type
    });
  }
  
}
