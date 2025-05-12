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
    typesRessource: '',
    cost: 0,
  };

  constructor(private rs: RessourceService, private router: Router) {}

  addRessource() {
    if (this.isFormValid()) {
      this.rs.createRessource(this.ressource).subscribe(
        () => {
          alert('Ressource ajoutée avec succès !');
          this.router.navigate(['/ViewRessource']); // Redirection après ajout
        },
        error => {
          console.error('Erreur lors de l’ajout de la ressource:', error);
        }
      );
    } else {
      alert('Veuillez remplir tous les champs correctement.');
    }
  }

  private isFormValid(): boolean {
    return (
      this.ressource.nomRessource.trim() !== '' &&
      this.ressource.nombreRessource > 0 &&
      this.ressource.typesRessource.trim() !== '' &&
      this.ressource.cost > 0
    );
  }
}
