import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupplierService } from '../../service/Supplier/supplier.service';
import { Supplier } from '../../model/supplier.module';

@Component({
  selector: 'app-add-supplier',
  templateUrl: './add-supplier.component.html',
  styleUrls: ['./add-supplier.component.css'],
})
export class AddSupplierComponent implements OnInit {
  supplierForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    contactPerson: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    status: ['', Validators.required],
    industry: ['', Validators.required],
    taxId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]],
    isPreferredSupplier: [false],
    blacklisted: [false],
  });

  successMessage: string | null = null; // Flag for success message

  // Define the list of supplier statuses
  statusList: string[] = ['Active', 'Inactive', 'Pending', 'Suspended'];

  constructor(
    private supplierService: SupplierService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Additional initialization logic can go here
  }

  // Submit form to add supplier
  onSubmit(): void {
    if (this.supplierForm.valid) {
      const supplier: Supplier = this.supplierForm.value;

      // Call the service to add the supplier
      this.supplierService.createSupplier(supplier).subscribe(
        (response) => {
          // Set success message
          this.successMessage = 'Supplier added successfully!';

          // Clear the success message after 5 seconds
          setTimeout(() => {
            this.clearSuccessMessage();
          }, 5000);

          // Navigate to a different page after successful addition
          this.router.navigate(['/view-supplier']);
        },
        (error) => {
          console.error('Error adding supplier', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
  }
}