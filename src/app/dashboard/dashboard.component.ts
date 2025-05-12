import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/Views/service/project.service';
import { Project } from 'src/app/Views/model/project';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  totalProjects: number = 0;
  completedProjects: number = 0;
  overdueProjects: number = 0;
  plannedProjects: number = 0;
  inProgressProjects: number = 0;
  averageCompletionTime: string = '';
  recentActivities: any[] = [];
  filterStartDate: string = '';
  filterEndDate: string = '';
  chart: any;
  progressChart: any;
  metrics = [
    { title: 'Total Projects', value: 120 },
    { title: 'Completed Projects', value: 95 },
    { title: 'Overdue Projects', value: 15 },
    { title: 'Planned Projects', value: 25 },
    { title: 'In Progress Projects', value: 30 }
  ];

  constructor(private projectService: ProjectService) {
    Chart.register(...registerables); // Register chart.js components
  }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getAllProjects().subscribe({
      next: (data: Project[]) => {
        this.projects = data;
        this.filteredProjects = data;  // Initially show all projects
        this.calculateMetrics();
        this.createCharts();
        this.loadRecentActivities();
        this.calculateAverageCompletionTime();
      },
      error: (error) => console.error('Error fetching projects:', error)
    });
  }

  calculateMetrics(): void {
    this.totalProjects = this.projects.length;
    this.completedProjects = this.projects.filter(p => p.etatProjet === 'TERMINE').length;
    this.overdueProjects = this.projects.filter(p => {
      const endDate = new Date(p.dateFin);
      const today = new Date();
      return p.etatProjet !== 'TERMINE' && endDate < today;
    }).length;
    this.plannedProjects = this.projects.filter(p => p.etatProjet === 'PLANIFIE').length;
    this.inProgressProjects = this.projects.filter(p => p.etatProjet === 'EN_COURS').length;
  }

  calculateAverageCompletionTime(): void {
    const completedProjects = this.projects.filter(p => p.etatProjet === 'TERMINE');
    if (completedProjects.length > 0) {
      const totalCompletionTime = completedProjects.reduce((acc, project) => {
        const startDate = new Date(project.dateDebut);
        const endDate = new Date(project.dateFin);
        const diffInTime = endDate.getTime() - startDate.getTime();
        return acc + diffInTime;
      }, 0);
      const avgTime = totalCompletionTime / completedProjects.length;
      this.averageCompletionTime = this.formatTime(avgTime);
    }
  }

  formatTime(timeInMs: number): string {
    const days = Math.floor(timeInMs / (1000 * 3600 * 24));
    const hours = Math.floor((timeInMs % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeInMs % (1000 * 3600)) / (1000 * 60));
    return `${days} days, ${hours} hours, ${minutes} minutes`;
  }

  loadRecentActivities(): void {
    // Sort projects by updatedAt in descending order and take the first 5
    this.recentActivities = this.projects
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(project => ({
        name: project.nomProjet,
        status: project.etatProjet,
        updatedAt: project.updatedAt
      }));
  }

  createCharts(): void {
    const statusData = [this.plannedProjects, this.inProgressProjects, this.completedProjects];
    this.chart = new Chart('projectStatusChart', {
      type: 'pie',
      data: {
        labels: ['Planned', 'In Progress', 'Completed'],
        datasets: [{
          label: 'Project Status',
          data: statusData,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        }
      }
    });

    // Project progress bar (example: one for in-progress projects)
    const progressData = this.projects.map(p => {
      const endDate = new Date(p.dateFin);
      const startDate = new Date(p.dateDebut);
      const progress = Math.min(100, ((new Date().getTime() - startDate.getTime()) / (endDate.getTime() - startDate.getTime())) * 100);
      return progress;
    });
    this.progressChart = new Chart('projectProgressChart', {
      type: 'bar',
      data: {
        labels: this.projects.map(p => p.nomProjet),
        datasets: [{
          label: 'Project Progress',
          data: progressData,
          backgroundColor: '#36A2EB',
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: { display: true },
          y: { beginAtZero: true, max: 100 }
        }
      }
    });
  }

  applyDateFilter(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesStartDate = !this.filterStartDate || new Date(project.dateDebut) >= new Date(this.filterStartDate);
      const matchesEndDate = !this.filterEndDate || new Date(project.dateFin) <= new Date(this.filterEndDate);
      return matchesStartDate && matchesEndDate;
    });
  }
}
