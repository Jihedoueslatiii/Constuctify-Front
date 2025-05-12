import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Urls } from 'src/app/url/url';

@Component({
  selector: 'app-affect-project',
  templateUrl: './affect-project.component.html',
  styleUrls: ['./affect-project.component.css']
})
export class AffectProjectComponent implements OnInit {
  resourceId!: number;
  projects: any[] = [];
  selectedProjectId!: number;  // Assurez-vous que le type est number
  nombreRessource!: number;    // Ajout de nombreRessource
  private apiUrl: string = Urls.serverpath2;

  // Injection de HttpClient
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private ressourceService: RessourceService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.resourceId = +idParam;
    }
    this.loadProjects();
  }

  loadProjects(): void {
    const projectUrl = `${this.apiUrl}getAllProjets`;
    
    this.http.get<any[]>(projectUrl).subscribe({
      next: (data) => {
        this.projects = data;
        console.log('Projets récupérés :', data);
      },
      error: (err) => console.error('Erreur lors de la récupération des projets', err)
    });
  }

  // Trouver le nom du projet à partir de l'idProjet
  getNomProjet(idProjet: number): string {
    const projet = this.projects.find(p => p.idProjet === idProjet);
    return projet ? projet.nomProjet : 'Non assigné'; // Retourne "Non assigné" si aucun projet trouvé
  }

  assignToProject(): void {
    const projectIdNumber = +this.selectedProjectId; // Convertit en nombre
    if (!projectIdNumber) {
      alert('Veuillez sélectionner un projet');
      return;
    }

    // Appel du service pour affecter la ressource
    this.ressourceService.assignResourceToProject(this.resourceId, projectIdNumber, this.nombreRessource)
      .subscribe({
        next: (response) => {
          // Logique en cas de succès
          console.log('Affectation réussie', response);
          alert(`Ressource ${this.resourceId} affectée au projet ${projectIdNumber}`);
          // Redirection vers la liste des ressources
          this.router.navigate(['/ViewRessource']);
        },
        error: (err) => {
          // Logique en cas d'erreur
          console.error('Erreur lors de l\'affectation de la ressource :', err);
        }
      });
  }
}
