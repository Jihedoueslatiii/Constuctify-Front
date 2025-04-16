import { Component, OnInit } from '@angular/core';
import { DeliverableService } from '../../service/deliverable.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-deliverable',
  templateUrl: './view-deliverable.component.html',
  styleUrls: ['./view-deliverable.component.css']
})
export class ViewDeliverableComponent implements OnInit {
  listDeliverable: any[] = []; 
  filteredDeliverables: any[] = []; 
  searchTerm: string = '';

  constructor(
    private rs: DeliverableService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.rs.getDeliverables().subscribe(
      res => {
        this.listDeliverable = res;
        this.filteredDeliverables = res; // Initialisation
      },
      error => {
        console.error('Erreur de récupération des deliverables:', error);
      }
    );
  }

  deleteDeliverable(id: number): void {
    if (confirm("Voulez-vous vraiment supprimer ce deliverable ?")) {
      this.rs.deleteDeliverable(id).subscribe({
        next: () => {
          this.listDeliverable = this.listDeliverable.filter(res => res.idDeliverable !== id);
          this.filterDeliverables(); // Mettre à jour après suppression
        },
        error: (err) => console.error('Erreur lors de la suppression du deliverable:', err)
      });
    }
  }

  filterDeliverables(): void {
    this.filteredDeliverables = this.listDeliverable.filter(deliverable =>
      deliverable.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      deliverable.delivery_date.includes(this.searchTerm) ||
      deliverable.expected_date.includes(this.searchTerm)
    );
    console.log("Deliverables filtrés :", this.filteredDeliverables);
  }
  

  onSearchChange(term: string) {
    console.log("Terme reçu pour la recherche :", term);
    this.searchTerm = term;
    this.filterDeliverables();
  }
  
}
