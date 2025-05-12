import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportPopupComponent } from 'src/app/Views/report-popup/report-popup.component';
import { Report, ReportStatus, ReportType } from 'src/app/Views/model/report.module';
import { ReportTranslation } from 'src/app/Views/model/ReportTranslation.module';
import { ReportsService } from 'src/app/Views/service/Supplier/reports.service';
import { UpdateReportComponent } from '../updatereport/updatereport.component';
import { PaginationInstance } from 'ngx-pagination';
import { Router } from '@angular/router';
import { CreateScheduleDto } from 'src/app/Views/model/create-schedule.dto';
import { ReportSchedulerService } from 'src/app/Views/service/Supplier/report-scheduler.service';
import { SchedulerComponent } from '../scheduler.component';

@Component({
  selector: 'app-view-reports',
  templateUrl: './viewreports.component.html',
  styleUrls: ['./viewreports.component.css']
})
export class ViewReportsComponent implements OnInit {
  @ViewChild('translationDialog') translationDialog!: TemplateRef<any>;
  reports: Report[] = [];  
  searchTerm: string = '';
  selectedStatus: ReportStatus | '' = '';
  page: number = 1;
  itemsPerPage: number = 6;
  currentReportForTranslation!: Report;
  availableLanguages: string[] = ['en', 'fr', 'es', 'ar'];
  originalTitle: string = '';
  originalDescription: string = '';

  config: PaginationInstance = {
    id: 'reportsPagination',
    itemsPerPage: 6,
    currentPage: 1,
  };

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private schedulerService: ReportSchedulerService
  ) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  fetchReports(): void {
    this.reportsService.getReports().subscribe({
      next: (data: Report[]) => { 
        this.reports = data.map(report => ({
          ...report,
          originalTitle: report.title,
          originalDescription: report.description
        }));
      },
      error: (error: any) => { 
        console.error('Error fetching reports:', error);
        this.showSnackbar('Error loading reports');
      }
    });
  }

  filteredReports(): Report[] {
    return this.reports.filter(report => 
      (this.searchTerm === '' || report.title.toLowerCase().includes(this.searchTerm.toLowerCase())) &&
      (this.selectedStatus === '' || report.status === this.selectedStatus)
    );
  }

  get pagedReports(): Report[] {
    const startIndex = (this.page - 1) * this.itemsPerPage;
    return this.filteredReports().slice(startIndex, startIndex + this.itemsPerPage);
  }

  ArchiveReport(id: number): void {
    if (confirm('Are you sure you want to archive this report?')) {
      this.reportsService.archiveReport(id).subscribe({
        next: () => {
          const reportToArchive = this.reports.find(report => report.idReport === id);
          if (reportToArchive) {
            reportToArchive.status = ReportStatus.ARCHIVED;
          }
        },
        error: (error: any) => {
          console.error('Error archiving report:', error);
          this.showSnackbar('Error archiving report');
        }
      });
    }
  }

  deleteReport(id: number): void {
    if (confirm('Are you sure you want to delete this report?')) {
      this.reportsService.deleteReport(id).subscribe({
        next: () => {
          this.reports = this.reports.filter(report => report.idReport !== id);
        },
        error: (error: any) => {
          console.error('Error deleting report:', error);
          this.showSnackbar('Error deleting report');
        }
      });
    }
  }

  generateReport() {
    const dialogRef = this.dialog.open(ReportPopupComponent, {
      width: '400px',
      data: {
        title: 'Sample Report',
        description: 'This is a sample report.',
        type: '',
        status: ''
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'add') {
        const generatedReport = dialogRef.componentInstance.getReportData();
        this.addReportToDatabase(generatedReport);
      }
    });
  }

  addReportToDatabase(report: any) {
    this.reportsService.addReport(report).subscribe({
      next: (response: Report) => {
        this.reports.push({
          ...response,
          originalTitle: response.title,
          originalDescription: response.description
        });
      },
      error: (error: any) => {
        console.error('Error adding report:', error);
        this.showSnackbar('Error adding report');
      }
    });
  }

  generatePerformanceReport() {
    this.reportsService.downloadPdf().subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'TopSuppliers.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error: any) => {
        console.error('Error downloading PDF:', error);
        this.showSnackbar('Error downloading PDF');
      }
    });
  }
  
  onUpdate(report: Report): void {
    const dialogRef = this.dialog.open(UpdateReportComponent, {
      width: '400px',
      data: { report }
    });

    dialogRef.afterClosed().subscribe((updatedReport: Report) => {
      if (updatedReport) {
        this.updateReportInDatabase(updatedReport);
      }
    });
  }

  updateReportInDatabase(report: Report): void {
    this.reportsService.updateReport(report.idReport, report).subscribe({
      next: (response: Report) => {
        const index = this.reports.findIndex(r => r.idReport === report.idReport);
        if (index !== -1) {
          this.reports[index] = {
            ...response,
            originalTitle: response.title,
            originalDescription: response.description
          };
        }
      },
      error: (error: any) => {
        console.error('Error updating report:', error);
        this.showSnackbar('Error updating report');
      }
    });
  }
  
  onPageChange(page: number): void {
    this.config.currentPage = page;
  }

  openTranslationDialog(report: Report): void {
    this.currentReportForTranslation = report;
    this.originalTitle = report.originalTitle;
    this.originalDescription = report.originalDescription;
    
    this.dialog.open(this.translationDialog, {
      width: '500px',
      panelClass: 'translation-dialog-container'
    });
  }

  selectLanguage(languageCode: string): void {
    if (languageCode === 'en') {
      this.resetToOriginal();
      this.dialog.closeAll();
      return;
    }
  
    this.reportsService.getTranslation(this.currentReportForTranslation.idReport, languageCode).subscribe({
      next: (translation: ReportTranslation | null) => {
        if (translation) {
          this.applyTranslation(translation);
        } else {
          this.handleMissingTranslation(languageCode);
        }
      },
      error: (error: any) => {
        console.error('Error loading translation:', error);
        this.showSnackbar('Error loading translation');
      }
    });
  }
  
  private resetToOriginal(): void {
    if (this.currentReportForTranslation) {
      this.currentReportForTranslation.title = this.originalTitle;
      this.currentReportForTranslation.description = this.originalDescription;
    }
  }

  private applyTranslation(translation: ReportTranslation): void {
    this.currentReportForTranslation.title = translation.title;
    this.currentReportForTranslation.description = translation.description;
    this.showSnackbar(`${this.getLanguageName(translation.languageCode)} translation loaded`);
  }

  private handleMissingTranslation(languageCode: string): void {
    const langName = this.getLanguageName(languageCode);
    const confirmMessage = `No ${langName} translation found. Would you like to create one?`;
    
    if (confirm(confirmMessage)) {
      this.createNewTranslation(languageCode);
    }
  }

  private getLanguageName(code: string): string {
    const languages: Record<string, string> = {
      'en': 'English',
      'fr': 'French',
      'es': 'Spanish',
      'ar': 'Arabic'
    };
    return languages[code] || code;
  }

  private createNewTranslation(languageCode: string): void {
    const newTranslation: ReportTranslation = {
      languageCode: languageCode,
      title: this.originalTitle,
      description: this.originalDescription,
      reportId: this.currentReportForTranslation.idReport
    };

    this.reportsService.addTranslation(this.currentReportForTranslation.idReport, newTranslation).subscribe({
      next: (translation: ReportTranslation) => {
        this.applyTranslation(translation);
        this.showSnackbar(`${this.getLanguageName(languageCode)} translation created`);
      },
      error: (error: any) => {
        console.error('Error creating translation:', error);
        this.showSnackbar('Error creating translation');
      }
    });
  }

  private showSnackbar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  viewTranslatedReports(lang: string): void {
    this.router.navigate(['reports/translated', lang]);
  }

  openScheduler(report: Report): void {
    const dialogRef = this.dialog.open(SchedulerComponent, {
      width: '80%',
      height: '90%',
      data: { report }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.fetchReports();
      }
    });
  }
}