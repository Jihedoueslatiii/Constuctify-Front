import { Component, OnInit } from '@angular/core';
import { ReportsService } from 'src/app/Views/service/reports.service';
import { Report } from 'src/app/Views/model/report.module'; 
import { ReportSchedulerService } from 'src/app/Views/service/report-scheduler.service';
import { Schedule } from 'src/app/Views/model/schedule.model';

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  selectedReport: Report | null = null;
  activeSchedules: Schedule[] = [];
  isCreatingSchedule = false;
  isLoading = false;
  availableReports: Report[] = [];

  constructor(
    private reportService: ReportsService,
    private schedulerService: ReportSchedulerService
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.isLoading = true;
    this.reportService.getReports().subscribe({
      next: (reports: Report[]) => {
        this.availableReports = reports;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load reports', err);
        this.isLoading = false;
      }
    });
  }

  handleReportSelected(report: Report): void {
    this.selectedReport = report;
    this.isCreatingSchedule = false;
    this.loadSchedulesForReport(report.idReport);
  }

  handleScheduleCreated(): void {
    if (this.selectedReport) {
      this.loadSchedulesForReport(this.selectedReport.idReport);
    }
    this.isCreatingSchedule = false;
  }

  loadSchedulesForReport(reportId: number): void {
    this.isLoading = true;
    this.schedulerService.getSchedulesForReport(reportId).subscribe({
      next: (schedules: Schedule[]) => {
        this.activeSchedules = schedules;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load schedules', err);
        this.isLoading = false;
      }
    });
  }
}