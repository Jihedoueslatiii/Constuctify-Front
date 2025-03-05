import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SupplierService } from '../../service/supplier.service';
import { Router } from '@angular/router';
import { Supplier } from '../../model/supplier.module';

@Component({
  selector: 'app-view-supplier',
  templateUrl: './view-supplier.component.html',
  styleUrls: ['./view-supplier.component.css']
})
export class ViewSupplierComponent implements OnInit {
  suppliers: Supplier[] = [];
  filteredSuppliers: Supplier[] = [];
  preferredSuppliers: Supplier[] = [];
  underReviewSuppliers: Supplier[] = [];
  blacklistedSuppliers: Supplier[] = [];
  successMessage: string = '';
  searchQuery: string = '';

  // Pagination variables
  p: number = 1; // Current page
  itemsPerPage: number = 5; // Items per page

  constructor(
    private supplierService: SupplierService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchSuppliers();
  }

  fetchSuppliers(): void {
    this.supplierService.getSuppliers().subscribe({
      next: (data: Supplier[]) => {
        this.suppliers = data;
        this.filterSuppliers();
      },
      error: (error) => {
        console.error('Error fetching suppliers:', error);
      }
  /**
   * Filter the suppliers based on the search query and update the filtered suppliers list.
   * Additionally, update the preferred, under review, and blacklisted suppliers lists.
   */
    });
  }

  filterSuppliers(): void {
    this.filteredSuppliers = this.suppliers.filter(s =>
      s.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.phoneNumber.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      s.status.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.preferredSuppliers = this.suppliers.filter(s => s.status === 'Preferred');
    this.underReviewSuppliers = this.suppliers.filter(s => s.status === 'Under Review');
    this.blacklistedSuppliers = this.suppliers.filter(s => s.status === 'Blacklisted');
  }

  drop(event: CdkDragDrop<Supplier[]>, newStatus: string): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const supplier = event.container.data[event.currentIndex];
      supplier.status = newStatus;

      this.supplierService.updateSupplier(supplier.idSupplier!, supplier).subscribe({
        next: () => {
          console.log('Supplier status updated');
          this.fetchSuppliers();
        },
        error: (error) => console.error('Error updating supplier:', error),
      });
    }
  }

  deleteSupplier(id: number): void {
    const confirmDelete = confirm('Are you sure you want to delete this supplier?');
    if (confirmDelete) {
      this.supplierService.deleteSupplier(id).subscribe({
        next: () => {
          this.successMessage = 'Supplier deleted successfully!';
          setTimeout(() => {
            this.clearSuccessMessage();
          }, 5000);
          this.fetchSuppliers();
        },
        error: (error) => {
          console.error('Error deleting supplier:', error);
        }
      });
    }
  }

  clearSuccessMessage(): void {
    this.successMessage = '';
  }

  openSupplierDetails(supplier: Supplier): void {
    this.router.navigate(['/supplier-details', supplier.idSupplier]);
  }
}