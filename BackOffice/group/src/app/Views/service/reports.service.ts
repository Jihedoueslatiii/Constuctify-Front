import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Report } from '../model/report.module';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  // Base URL for the reports API
  private apiUrl = 'http://localhost:8090/Reports/api/reports';

  constructor(private http: HttpClient) { }

  // Method to get all reports
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/all`); // Fetch all reports
  }

  // Method to archive a report by its ID
  archiveReport(id: number): Observable<void> {
    const archiveUrl = `${this.apiUrl}/${id}/archive`; // Endpoint to archive the report
    return this.http.put<void>(archiveUrl, {}); // Send a PUT request to archive the report
  }

  // Method to delete a report by its ID
  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



    // Method to add a new report
    addReport(report: Report): Observable<Report> {
      return this.http.post<Report>(`${this.apiUrl}/add`, report); // Send a POST request to add the report
    }

    generateReportFile(reportId: number) {
      return this.http.post<any>('/api/generate-report', { reportId });
    }

    downloadPdf() {
      return this.http.get(`${this.apiUrl}/download`, { responseType: 'blob' });
    }

    updateReport(id: number, report: Report): Observable<Report> {
      const url = `${this.apiUrl}/${id}`;
      return this.http.put<Report>(url, report);
    }
}