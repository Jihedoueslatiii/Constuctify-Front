import { Component } from '@angular/core';
import { RessourceService } from '../../service/ressource.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ressource',
  templateUrl: './add-ressource.component.html',
  styleUrls: ['./add-ressource.component.css']
})
export class AddRessourceComponent {
  ressource = {
    nomRessource: '',
    nombreRessource: 0,
    typesRessource: ''
  };

  constructor(private rs: RessourceService, private router: Router) {}

  addRessource() {
    if (this.ressource.nomRessource && this.ressource.nombreRessource > 0 && this.ressource.typesRessource) {
      this.rs.createRessource(this.ressource).subscribe(
        () => {
          alert('Ressource ajoutée avec succès !');
          this.router.navigate(['/view-ressource']); // Redirection après ajout
        },
        error => {
          console.error('Erreur lors de l’ajout de la ressource:', error);
        }
      );
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }
}
