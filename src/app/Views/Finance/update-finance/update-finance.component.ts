import { Component, OnInit } from '@angular/core';
import { Finance } from '../../model/finance.module';
import { ActivatedRoute, Router } from '@angular/router';
import { FinanceService } from '../../service/finance.service';

@Component({
  selector: 'app-update-finance',
  templateUrl: './update-finance.component.html',
  styleUrls: ['./update-finance.component.css']
})
export class UpdateFinanceComponent implements OnInit {
  Finance: Finance = new Finance(0,0, 0, 0, '', 0);

  constructor(
    private route: ActivatedRoute,
    private FinanceService: FinanceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.FinanceService.getFinanceById(id).subscribe({
        next: (data) => {
          this.Finance = data; // Assign the retrieved resource
        },
        error: (err) => console.error('Error fetching resource:', err)
      });
    }
  }

  updateFinance(): void {
    // Basic validation before updating
    if (this.isFormValid()) {
      this.FinanceService.updateFinance(this.Finance.financeId, this.Finance)
        .subscribe({
          next: (response) => {
            console.log('Finance updated successfully', response);
            this.router.navigate(['/ViewFinance']); // Redirect after update
          },
          error: (err) => {
            console.error('Error updating resource:', err);
          }
        });
    } else {
      console.error('Form is not valid. Please check your inputs.');
    }
  }

  // Method to check if the form inputs are valid
  isFormValid(): boolean {
    return (
      this.Finance.description.trim() !== '' &&
      this.Finance.budget >= 0 &&
      this.Finance.otherExpenses >= 0 &&
      this.Finance.roi >= 0
    );
  }
}
