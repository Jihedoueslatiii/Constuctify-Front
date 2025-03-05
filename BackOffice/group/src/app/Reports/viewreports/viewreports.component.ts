import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ReportPopupComponent } from 'src/app/report-popup/report-popup.component';
import { Report, ReportStatus } from 'src/app/Views/model/report.module';
import { ReportsService } from 'src/app/Views/service/reports.service';
import { UpdateReportComponent } from '../updatereport/updatereport.component';
import { PaginationInstance } from 'ngx-pagination'; // Import PaginationInstance


@Component({
  selector: 'app-view-reports',
  templateUrl: './viewreports.component.html',
  styleUrls: ['./viewreports.component.css']
})
export class ViewReportsComponent implements OnInit {
  reports: Report[] = [];  
  searchTerm: string = '';  // Search input
  selectedStatus: ReportStatus | '' = ''; // Dropdown filter
  page: number = 1; // Current page
  itemsPerPage: number = 6; // Number of items per page

  config: PaginationInstance = {
    id: 'reportsPagination', // Explicitly set a string value
    itemsPerPage: 6, // Number of items per page
    currentPage: 1, // Current page
  };

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog // Inject MatDialog
  ) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.reportsService.getReports().subscribe(
      (data) => { 
        console.log('Fetched Reports:', data); // Debugging
        this.reports = data; 
      },
      (error) => { 
        console.error('Error fetching reports:', error); 
      }
    );
  }

  // Filter reports based on search and status
  filteredReports(): Report[] {
    return this.reports.filter(report => 
      (this.searchTerm === '' || report.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedStatus === '' || report.status === this.selectedStatus)
    );
  }

  // Get paginated reports
  get pagedReports(): Report[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredReports().slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Archive a report
  ArchiveReport(id: number): void {
    if (confirm('Are you sure you want to archive this report?')) {
      this.reportsService.archiveReport(id).subscribe(() => {
        // Update the report status in the local list
        const reportToArchive = this.reports.find(report => report.idReport === id);
        if (reportToArchive) {
          reportToArchive.status = ReportStatus.ARCHIVED; 
        }
      });
    }
  }

  // Delete a report
  deleteReport(id: number): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportsService.deleteReport(id).subscribe(() => {
        // Remove the deleted report from the local list
        this.reports = this.reports.filter(report => report.idReport !== id);
      });
    }
  }

  generateReport() {
    // Open the popup
    const dialogRef = this.dialog.open(ReportPopupComponent, {
      width: '400px',
      data: {
        title: 'Sample Report',
        description: 'This is a sample report.',
        type: '', // Initially empty, user will select
        status: '' // Initially empty, user will select
      }
    });

    // Handle the popup result
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add') {
        const generatedReport = dialogRef.componentInstance.getReportData(); // Get the data from the popup
        this.addReportToDatabase(generatedReport);
      }
    });
  }

  addReportToDatabase(report: any) {
    this.reportsService.addReport(report).subscribe(
      (response) => {
        console.log('Report added to database:', response);
        // Add the new report to the local list
        this.reports.push(response);
      },
      (error) => {
        console.error('Error adding report:', error);
      }
    );
  }

  generatePerformanceReport() {
    this.reportsService.downloadPdf().subscribe(response => {
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'TopSuppliers.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    }, error => {
      console.error('Erreur lors du téléchargement du PDF:', error);
    });
  }
  
  downloadReport(filePath: string) {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = filePath;
    link.download = filePath.substring(filePath.lastIndexOf('/') + 1); // Extract the file name
    document.body.appendChild(link);
    link.click(); // Simulate a click to trigger the download
    document.body.removeChild(link); // Clean up
  }
  
  // Open the update dialog
  onUpdate(report: Report): void {
    const dialogRef = this.dialog.open(UpdateReportComponent, {
      width: '400px',
      data: { report } // Pass the selected report to the dialog
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe((updatedReport: Report) => {
      if (updatedReport) {
        this.updateReportInDatabase(updatedReport); // Update the report in the database
      }
    });
  }

  // Update the report in the database
  updateReportInDatabase(report: Report): void {
    this.reportsService.updateReport(report.idReport, report).subscribe(
      (response) => {
        console.log('Report updated:', response);
        // Update the report in the local list
        const index = this.reports.findIndex(r => r.idReport === report.idReport);
        if (index !== -1) {
          this.reports[index] = response; // Update the local report with the response
        }
      },
      (error) => {
        console.error('Error updating report:', error);
      }
    );
  }
  
    // Handle page change event
    onPageChange(page: number): void {
      this.config.currentPage = page;
    }
}