import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-report-popup',
  templateUrl: './report-popup.component.html',
  styleUrls: ['./report-popup.component.css']
})
export class ReportPopupComponent {
  selectedType: string = ''; // <-- Ensure this property exists
  selectedStatus: string = ''; // <-- Ensure this property exists

  // Define available types and statuses
  reportTypes: string[] = ['CONTRACT_SUMMARY', 'FINANCIAL_REPORT', 'PERFORMANCE_REPORT'];
  reportStatuses: string[] = ['PENDING', 'COMPLETED', 'ARCHIVED'];

  constructor(
    public dialogRef: MatDialogRef<ReportPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize selected values with data passed from the parent
    this.selectedType = data.type;
    this.selectedStatus = data.status;
  }

  // Method to get the final report data
  getReportData() {
    return {
      title: this.data.title,
      description: this.data.description,
      type: this.selectedType,
      status: this.selectedStatus
    };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onAdd(): void {
    this.dialogRef.close('add');
  }
}