import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierService } from '../../service/supplier.service';
import { Supplier } from '../../model/supplier.module';
import emailjs from 'emailjs-com';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css'],
})
export class UpdateSupplierComponent implements OnInit {
  supplierForm!: FormGroup;
  supplier: Supplier = {
    idSupplier: 0,
    name: '',
    contactPerson: '',
    email: '',
    phoneNumber: '',
    address: '',
    status: '',
    industry: '',
    rating: 0,
    taxId: '',
    totalContractValue: 0,
    preferredSupplier: false,
    reliabilityScore: 0,
    blacklisted: false,
    tags: [],
    dateAdded: '',
    lastUpdated: '',
    underReview: false,
  };

  constructor(
    private route: ActivatedRoute,
    private supplierService: SupplierService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.supplier.idSupplier = id;
      this.loadSupplierDetails(id);
    }

    this.supplierForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      contactPerson: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      status: ['', Validators.required],
      industry: ['', Validators.required],
      rating: [0, [Validators.required, Validators.min(0), Validators.max(5)]],
      taxId: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9]{10}$/)]],
      totalContractValue: [0, Validators.required],
      preferredSupplier: [false],
      reliabilityScore: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      blacklisted: [false],
    });
  }

  loadSupplierDetails(id: number): void {
    this.supplierService.getSupplierById(id).subscribe({
      next: (data) => {
        this.supplier = data;
        this.supplierForm.patchValue(data);
      },
      error: (err) => {
        console.error('Failed to load supplier details:', err);
      },
    });
  }

  updateSupplier(): void {
    if (this.supplierForm.valid && this.supplier.idSupplier) {
      const updatedSupplier = { ...this.supplier, ...this.supplierForm.value };

      this.supplierService.updateSupplier(this.supplier.idSupplier, updatedSupplier).subscribe({
        next: () => {
          console.log('Supplier updated successfully');

          if (updatedSupplier.reliabilityScore < 50) {
            this.sendHighRiskEmail(updatedSupplier);
          }

          this.router.navigate(['/view-supplier']);
        },
        error: (err) => {
          console.error('Error updating supplier:', err);
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }

  sendHighRiskEmail(supplier: Supplier): void {
    const emailParams = {
      to_email: 'elamarzouky00@gmail.com',
      name: supplier.name,
      idSupplier: supplier.idSupplier,
      reliabilityScore: supplier.reliabilityScore,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phoneNumber: supplier.phoneNumber,
      address: supplier.address,
      status: supplier.status,
    };

    emailjs
      .send(
        'service_d8iz9bo',
        'template_4nx5kig',
        emailParams,
        'Hw9uDPL-2P7R7SuWC'
      )
      .then(
        (response) => {
          console.log('Email sent successfully!', response);
        },
        (error) => {
          console.error('Failed to send email:', error);
          console.error('Error details:', error.text);
        }
      );
  }
}
