import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Report } from 'src/app/Views/model/report.module'; 

@Component({
  selector: 'app-report-selector',
  templateUrl: './report-selector.component.html'
})
export class ReportSelectorComponent {
  @Input() reports: Report[] = [];
  @Output() reportSelected = new EventEmitter<Report>();

  selectReport(report: Report): void {
    this.reportSelected.emit(report);
  }
}