import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DeliverableService } from '../../service/deliverable.service';
import { Deliverable, DeliverableStatus } from '../../model/deliverable.module';

@Component({
  selector: 'app-update-deliverable',
  templateUrl: './update-deliverable.component.html',
  styleUrls: ['./update-deliverable.component.css']
})
export class UpdateDeliverableComponent implements OnInit {
  updateForm!: FormGroup;
  idDeliverable!: number;
  statusOptions = Object.values(DeliverableStatus);
  
  deliverable: Deliverable = {} as Deliverable; // Initialisation correcte

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private ds: DeliverableService
  ) {}

  ngOnInit(): void {
    this.idDeliverable = Number(this.route.snapshot.paramMap.get('id'));

    if (this.idDeliverable) {
      this.ds.getDeliverableById(this.idDeliverable).subscribe({
        next: (data) => {
          this.deliverable = data;
          this.updateForm = this.fb.group({
            name: [this.deliverable.name],
            expected_date: [this.deliverable.expected_date],
            delivery_date: [this.deliverable.delivery_date],
            status: [this.deliverable.status]
          });
        },
        error: (err) => console.error('Erreur lors de la récupération du livrable:', err)
      });
    }
  }

  updateDeliverable(): void {
    if (this.updateForm.valid) {
      this.ds.updateDeliverable(this.idDeliverable, this.updateForm.value).subscribe({
        next: () => {
          console.log('deliverable mise à jour avec succès');
          this.router.navigate(['/ViewDeliverable']);
        },
        error: (err) => console.error('Erreur lors de la mise à jour du livrable:', err)
      });
    }
  }
}
