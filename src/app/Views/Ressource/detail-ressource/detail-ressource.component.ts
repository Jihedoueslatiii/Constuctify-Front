import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RessourceService } from '../../service/ressource.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-ressource',
  templateUrl: './detail-ressource.component.html',
  styleUrls: ['./detail-ressource.component.css']
})
export class DetailRessourceComponent implements OnInit {
  ressourceId!: number;
  ressourceDetails: any;
  projects: { [key: number]: number } = {}; // Initialisation correcte

  constructor(
    private route: ActivatedRoute,
    private ressourceService: RessourceService,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.ressourceId = Number(this.route.snapshot.paramMap.get('id'));
    this.getRessourceDetails();
    
  }

 
  getRessourceDetails(): void {
    this.ressourceService.getRessourceById(this.ressourceId).subscribe(
      (data) => {
        this.ressourceDetails = data;
        this.getProjectsForRessource();
      },
      (error) => console.error('Erreur lors de la récupération de la ressource:', error)
    );
  }
  goBack(): void {
    this.location.back();
  }
  getProjectsForRessource(): void {
    this.ressourceService.getProjectsForRessource(this.ressourceId).subscribe(
      (projects) => this.projects = projects,
      (error) => console.error('Erreur lors de la récupération des projets:', error)
    );
  }
}
