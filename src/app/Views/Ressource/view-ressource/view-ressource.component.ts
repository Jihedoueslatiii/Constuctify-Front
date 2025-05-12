import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { Router } from '@angular/router';
import { Urls } from 'src/app/url/url';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-ressource',
  templateUrl: './view-ressource.component.html',
  styleUrls: ['./view-ressource.component.css']
})
export class ViewRessourceComponent implements OnInit {
  listRessource: Array<{
    idRessource: number;
    nomRessource: string;
    nombreRessource: number;
    typesRessource: string;
    cost: number;
    idProjet: number;
  }> = [];
  
  private apiUrl: string = Urls.serverpath2;
  projectsMap = new Map<number, { nomProjet: string, nombreRessource: number }>();
  destinataire: string = '';
  telephone: string = '';

  // Propriétés pour la pagination
  currentPage: number = 1;
  itemsPerPage: number = 5;

  constructor(
    private http: HttpClient,
    private rs: RessourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRessources();
  }

  loadRessources(): void {
    this.rs.getRessource().subscribe({
      next: (res) => {
        this.listRessource = res;
        console.log('🔹 Ressources récupérées:', res);
        this.loadProjectNamesAndCount();
      },
      error: (err) => console.error('❌ Erreur de récupération des ressources:', err)
    });
  }

  async loadProjectNamesAndCount(): Promise<void> {
    const projectIds = Array.from(new Set(this.listRessource.map(r => r.idProjet).filter(id => id != null)));

    if (projectIds.length === 0) {
      console.warn('⚠️ Aucun projet à récupérer.');
      return;
    }

    try {
      const requests = projectIds.map(async (idProjet) => {
        const projectUrl = `${this.apiUrl}projects/getProjectby/${idProjet}`;
        const projet = await this.http.get<any>(projectUrl).toPromise();

        if (projet && projet.projectId !== undefined && projet.name) {
          const nombreRessources = this.listRessource.filter(r => r.idProjet === idProjet).length;
          console.log(`✅ Projet récupéré: ${projet.projectId} → ${projet.name}`);
          this.projectsMap.set(projet.projectId, { nomProjet: projet.name, nombreRessource: nombreRessources });
        } else {
          console.warn(`⚠️ Projet mal formé pour idProjet=${idProjet}:`, projet);
        }
      });

      await Promise.all(requests);
      console.log('📌 ProjectsMap final:', this.projectsMap);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des projets:', err);
    }
  }

  getNomProjet(idProjet: number): string {
    const project = this.projectsMap.get(idProjet);
    return project ? `${project.nomProjet} (${project.nombreRessource} ressources)` : 'Non assigné';
  }

  getResourceCount(idProjet: number): number {
    return this.listRessource.filter(r => r.idProjet === idProjet).length;
  }

  refreshPage(): void {
    this.router.navigate([this.router.url]);
  }

  deleteRessource(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer cette ressource ?")) {
      this.rs.deleteRessource(id).subscribe({
        next: () => {
          this.listRessource = this.listRessource.filter(res => res.idRessource !== id);
          console.log(`🗑️ Ressource ${id} supprimée`);
        },
        error: (err) => console.error('❌ Erreur lors de la suppression de la ressource:', err)
      });
    }
  }

  sendReport(destinataire: string): void {
    if (!destinataire) {
        alert('Veuillez entrer une adresse email valide.');
        return;
    }

    this.rs.sendRessourceReport(destinataire).subscribe({
        next: (response) => {
            console.log('✅ Rapport envoyé:', response);
            alert('Le rapport a été envoyé avec succès.');
        },
        error: (err) => {
            console.error('❌ Erreur lors de l\'envoi du rapport:', err);
            alert('Une erreur est survenue lors de l\'envoi du rapport.');
        }
    });
  }
  sendsms(telephone: string): void {
    if (!telephone) {
        alert('Veuillez entrer un numero de telephone valide.');
        return;
    }

    this.rs.sendsms(telephone).subscribe({
        next: (response) => {
            console.log('✅ Rapport envoyé:', response);
            alert('Le rapport a été envoyé avec succès.');
        }
    });
  }



}
