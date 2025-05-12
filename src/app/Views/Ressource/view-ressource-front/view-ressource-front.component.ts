import { Component, OnInit } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-ressource-front',
  templateUrl: './view-ressource-front.component.html',
  styleUrls: ['./view-ressource-front.component.css']
})
export class ViewRessourceFrontComponent implements OnInit {
  listRessource: { idRessource: number; nomRessource: string; nombreRessource: number; typesRessource: string; cost: number }[] = [];

  constructor(
    private rs: RessourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRessources();
  }

  loadRessources(): void {
    this.rs.getRessource().subscribe({
      next: (res) => this.listRessource = res,
      error: (err) => console.error('Erreur de récupération des ressources:', err)
    });
  }
  refreshPage() {
    window.location.reload(); // Recharger la page
  }
  
}
