import { Component } from '@angular/core';
import { FinanceService } from '../../service/finance.service';

@Component({
  selector: 'app-assignefinancetoprojet',
  templateUrl: './assignefinancetoprojet.component.html',
  styleUrls: ['./assignefinancetoprojet.component.css']
})
export class AssignefinancetoprojetComponent {
  
  financeId: number = 0;
  projectId: number = 0;
  message: string = '';

  constructor(private financeService: FinanceService) {}

  assignProject() {
    if (this.financeId && this.projectId) {
      this.financeService.assignProjectToFinance(this.financeId, this.projectId)
        .subscribe({
          next: (response) => {
            this.message = 'Le projet a été assigné avec succès à la finance.';
            console.log(response);
          },
          error: (error) => {
            this.message = 'Erreur lors de l\'assignation du projet à la finance.';
            console.error(error);
          }
        });
    } else {
      this.message = 'Veuillez entrer des IDs valides pour la finance et le projet.';
    }
  }
}
