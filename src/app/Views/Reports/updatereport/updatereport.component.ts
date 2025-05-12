import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Report, ReportStatus } from 'src/app/Views/model/report.module';


@Component({
  selector: 'app-update-report',
  templateUrl: './updatereport.component.html',
  styleUrls: ['./updatereport.component.css']
})
export class UpdateReportComponent {
  report: Report;
  reportStatuses = ['PENDING', 'COMPLETED', 'FAILED', 'ARCHIVED']; // Example statuses

  constructor(
    public dialogRef: MatDialogRef<UpdateReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report }
  ) {
    // Create a copy of the report to avoid mutating the original data
    this.report = { ...data.report };
  }

  // Handle form submission
  onSubmit(): void {
    this.dialogRef.close(this.report); // Return the updated report
  }

  // Handle cancel button click
  onCancel(): void {
    this.dialogRef.close(); // Close the dialog without saving
  }
}