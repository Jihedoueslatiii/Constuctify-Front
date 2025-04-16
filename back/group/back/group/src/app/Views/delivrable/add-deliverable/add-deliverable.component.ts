import { Component } from '@angular/core';
import { DeliverableService } from '../../service/deliverable.service';
import { Router } from '@angular/router';
import { Deliverable, DeliverableStatus } from '../../model/deliverable.module';

@Component({
  selector: 'app-add-deliverable',
  templateUrl: './add-deliverable.component.html',
  styleUrls: ['./add-deliverable.component.css']
})
export class AddDeliverableComponent {
  deliverable: Deliverable = new Deliverable(0, '', new Date(), new Date(), DeliverableStatus.IN_PROGRESS);
  statusOptions = Object.values(DeliverableStatus); // ✅ Liste des statuts pour le select

  constructor(private ds: DeliverableService, private router: Router) {}

  addDeliverable() {
    console.log("Données envoyées :", this.deliverable); // ✅ Debug pour vérifier les valeurs envoyées

    if (!this.validateInput()) {
      return; // Stopper l'exécution si la validation échoue
    }

    this.ds.createDeliverable(this.deliverable).subscribe(
      () => {
        alert('Livrable ajouté avec succès !');
        this.router.navigate(['/ViewDeliverable']);
      },
      (error: any) => {
        console.error('Erreur lors de l’ajout du livrable:', error);
        alert('Erreur lors de l’ajout du livrable. Veuillez réessayer.');
      }
    );
  }

  validateInput(): boolean {
    const nameRegex = /^[A-Z][a-zA-Z ]*$/; // Commence par une majuscule, lettres et espaces autorisés

    if (!this.deliverable.name || !nameRegex.test(this.deliverable.name)) {
      alert('Le nom du livrable doit commencer par une majuscule et contenir uniquement des lettres.');
      return false;
    }

    if (!this.deliverable.expected_date || isNaN(new Date(this.deliverable.expected_date).getTime())) {
      alert('Veuillez entrer une date de livraison prévue valide.');
      return false;
    }

    if (!this.deliverable.delivery_date || isNaN(new Date(this.deliverable.delivery_date).getTime())) {
      alert('Veuillez entrer une date de livraison valide.');
      return false;
    }

    if (new Date(this.deliverable.delivery_date) < new Date(this.deliverable.expected_date)) {
      alert('La date de livraison ne peut pas être antérieure à la date prévue.');
      return false;
    }

    return true; // ✅ Toutes les validations sont passées
  }
}
