import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReportPopupComponent } from 'src/app/report-popup/report-popup.component';
import { Report, ReportStatus, ReportType } from 'src/app/Views/model/report.module';
import { ReportTranslation } from 'src/app/Views/model/ReportTranslation.module';
import { ReportsService } from 'src/app/Views/service/reports.service';
import { UpdateReportComponent } from '../updatereport/updatereport.component';
import { PaginationInstance } from 'ngx-pagination';
import { Router } from '@angular/router';
import { CreateScheduleDto } from 'src/app/Views/model/create-schedule.dto';
import { ReportSchedulerService } from 'src/app/Views/service/report-scheduler.service';
import { SchedulerComponent } from '../scheduler.component';
import { DomSanitizer } from '@angular/platform-browser';
import { CalendarOptions, EventInput, EventApi } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-view-reports',
  templateUrl: './viewreports.component.html',
  styleUrls: ['./viewreports.component.css']
})
export class ViewReportsComponent implements OnInit {
  @ViewChild('translationDialog') translationDialog!: TemplateRef<any>;
  @ViewChild('qrCodeDialog') qrCodeDialog!: TemplateRef<any>;
  
  // Calendar Configuration
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    weekends: true,
    events: [],
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: this.handleEventMount.bind(this),
    eventDrop: this.handleEventDrop.bind(this),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek'
    },
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      meridiem: false
    }
  };

  reports: Report[] = [];  
  visibleDays: any[] = [];
  searchTerm: string = '';
  selectedStatus: ReportStatus | '' = '';
  page: number = 1;
  itemsPerPage: number = 6;
  currentReportForTranslation!: Report;
  currentReportForQR!: Report;
  availableLanguages: string[] = ['en', 'fr', 'es', 'ar'];
  originalTitle: string = '';
  originalDescription: string = '';
  qrData: string = '';

  config: PaginationInstance = {
    id: 'reportsPagination',
    itemsPerPage: 6,
    currentPage: 1,
  };

  upcomingEvents: any[] = [];
legendItems = [
  { status: 'PENDING', label: 'Pending' },
  { status: 'COMPLETED', label: 'Completed' },
  { status: 'FAILED', label: 'Failed' },
  { status: 'ARCHIVED', label: 'Archived' }
];

  constructor(
    private reportsService: ReportsService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private schedulerService: ReportSchedulerService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.fetchReports();
  }

  // Calendar Methods
  private updateCalendarEvents(): void {
    const events: EventInput[] = this.reports.map(report => ({
      id: report.idReport.toString(),
      title: report.title,
      start: report.generatedDate,
      end: this.getDueDate(report),
      color: this.getEventColor(report.status),
      extendedProps: {
        reportId: report.idReport,
        status: report.status,
        type: report.reportType
      }
    }));

    this.calendarOptions.events = events;
    this.updateCalendarView();
  }

  private updateCalendarView(): void {
    // Group reports by day
    const daysMap = new Map<string, Report[]>();
    
    this.reports.forEach(report => {
      const dateKey = new Date(report.generatedDate).toDateString();
      if (!daysMap.has(dateKey)) {
        daysMap.set(dateKey, []);
      }
      daysMap.get(dateKey)?.push(report);
    });
    
    // Create visible days array
    this.visibleDays = Array.from(daysMap.entries()).map(([dateString, reports]) => ({
      date: new Date(dateString),
      reports: reports
    }));
    
    // Sort days chronologically
    this.visibleDays.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  getEventTopPosition(report: Report): string {
    const date = new Date(report.generatedDate);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    // 9 AM is our starting point (index 0)
    const hoursFromStart = Math.max(hours - 9, 0);
    const position = hoursFromStart * 60 + minutes;
    return `${position}px`;
  }

  getEventHeight(report: Report): string {
    // Default to 1 hour duration if no end date
    return '60px';
  }

  private handleEventMount(info: any): void {
    // Smart Deadline Alerts
    if (info.event.extendedProps.status === ReportStatus.PENDING) {
      const endDate = info.event.end ? new Date(info.event.end) : new Date(info.event.start);
      const daysUntilDue = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue <= 7) {
        info.el.classList.add('fc-event-urgent');
        info.el.title = `URGENT: Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`;
      } else if (daysUntilDue <= 14) {
        info.el.style.border = '2px solid #ff9800';
        info.el.title = `Warning: Due in ${daysUntilDue} days`;
      }
    }
  }

  private handleEventDrop(info: any): void {
    const reportId = +info.event.id;
    const newDate = info.event.start;
    const report = this.reports.find(r => r.idReport === reportId);
  
    if (report) {
      this.reportsService.updateReportDate(reportId, newDate).subscribe({
        next: () => {
          // Update the local report data
          report.generatedDate = newDate.toISOString();
          this.showSnackbar(`Rescheduled "${report.title}" to ${newDate.toLocaleDateString()}`);
          this.updateCalendarEvents();
        },
        error: (error) => {
          console.error('Error updating report date:', error);
          info.revert();
          this.showSnackbar('Failed to reschedule: ' + (error.error?.error || error.message));
        }
      });
    }
  }

  private handleEventClick(info: any): void {
    const reportId = +info.event.id;
    const report = this.reports.find(r => r.idReport === reportId);
    if (report) {
      this.showSnackbar(`Opening ${report.title} (Status: ${report.status})`);
      // Add navigation logic here if needed
    }
  }

  // Helper Methods
  private getDueDate(report: Report): string | undefined {
    if (report.reportType === ReportType.EXPIRING_CONTRACTS) {
      const date = new Date(report.generatedDate);
      date.setDate(date.getDate() + 30);
      return date.toISOString();
    }
    return undefined;
  }

  private getEventColor(status: ReportStatus): string {
    switch(status) {
      case ReportStatus.PENDING: return '#FFC107';
      case ReportStatus.COMPLETED: return '#4CAF50';
      case ReportStatus.FAILED: return '#F44336';
      case ReportStatus.ARCHIVED: return '#9E9E9E';
      default: return '#2196F3';
    }
  }

  // Existing Methods (with calendar integration)
  fetchReports(): void {
    this.reportsService.getReports().subscribe({
      next: (data: Report[]) => { 
        this.reports = data.map(report => ({
          ...report,
          originalTitle: report.title,
          originalDescription: report.description
        }));
        this.updateCalendarEvents();
        this.prepareUpcomingEvents();
      },
      error: (error) => { 
        console.error('Error fetching reports:', error);
        this.showSnackbar('Error loading reports');
      }
    });
  }

  private prepareUpcomingEvents(): void {
    // Get events for the next 7 days
    const now = new Date();
    const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    this.upcomingEvents = this.reports
      .filter(report => {
        const reportDate = new Date(report.generatedDate);
        return reportDate >= now && reportDate <= nextWeek;
      })
      .map(report => {
        const date = new Date(report.generatedDate);
        return {
          title: report.title,
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: report.status,
          date: date
        };
      })
      .sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Group by day for the header
    this.visibleDays = this.getVisibleDays();
  }
  
  private getVisibleDays(): any[] {
    const days = [];
    const today = new Date();
    
    // Get next 5 days including today
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push({ date });
    }
    
    return days;
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
            this.updateCalendarEvents();
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
          this.updateCalendarEvents();
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
        this.updateCalendarEvents();
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
          this.updateCalendarEvents();
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

  generateQRCode(report: Report): void {
    const ngrokUrl = localStorage.getItem('currentNgrokUrl') || 'https://your-fallback.ngrok.io';
    this.qrData = `${ngrokUrl}/reports/${report.idReport}`;
    this.currentReportForQR = report;
    
    setTimeout(() => {
      this.dialog.open(this.qrCodeDialog, {
        width: '350px',
        panelClass: 'qr-dialog-container'
      });
    }, 100);
  }

  downloadQRCode(): void {
    if (!this.currentReportForQR) {
      console.error('No report selected for QR download');
      return;
    }

    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      try {
        const link = document.createElement('a');
        link.download = `report-${this.currentReportForQR.idReport}-qr.png`;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error('Error downloading QR code:', error);
        this.showSnackbar('Error downloading QR code');
      }
    }
  }

  closeQRDialog(): void {
    this.dialog.closeAll();
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