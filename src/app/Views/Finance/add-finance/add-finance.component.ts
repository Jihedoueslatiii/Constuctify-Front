import { Component, OnInit } from '@angular/core';
import { FinanceService } from '../../service/finance.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-finance',
  templateUrl: './add-finance.component.html',
  styleUrls: ['./add-finance.component.css']
})
export class AddFinanceComponent implements OnInit {
  Finance = {
    budget: 0,
    otherExpenses: 0,
    description: '',
  };

  projectId: number = 0;
  projects: any[] = []; // Liste des projets

  constructor(private financeService: FinanceService, private router: Router) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects() {
    this.financeService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des projets :", error);
      }
    );
  }

  validateInputs(): boolean {
    if (
      this.Finance.budget <= 0 ||
      this.Finance.otherExpenses < 0 ||
      !this.Finance.description.trim() ||
      this.projectId <= 0
    ) {
      alert('Veuillez remplir tous les champs correctement.');
      return false;
    }
    return true;
  }

  addFinance() {
    if (this.validateInputs()) {
      this.financeService.createFinance(this.Finance).subscribe(
        (createdFinance) => {
          const financeId = createdFinance?.id || createdFinance?.financeId;
          if (financeId) {
            this.financeService.assignProjectToFinance(financeId, this.projectId).subscribe(
              () => {
                alert('Budget ajouté et projet assigné avec succès !');
                this.router.navigate(['/ViewFinance']);
              },
              error => {
                console.error('Erreur lors de l’assignation du projet :', error);
                alert('Budget ajouté, mais erreur d’assignation au projet.');
              }
            );
          } else {
            alert('Budget ajouté, mais impossible de récupérer son ID.');
          }
        },
        error => {
          console.error('Erreur lors de l’ajout du budget :', error);
          alert('Erreur lors de l’ajout du budget.');
        }
      );
    }
  }
}
