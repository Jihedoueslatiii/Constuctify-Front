import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Report } from 'src/app/Views/model/report.module';
import { ReportTranslation } from '../model/ReportTranslation.module';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private apiUrl = 'http://localhost:8090/Reports/api/reports';

  constructor(private http: HttpClient) { }

  // Basic CRUD operations
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/all`).pipe(
      catchError(this.handleError<Report[]>('getReports', []))
    );
  }

  getReportById(id: number): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<Report>('getReportById'))
    );
  }

  addReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.apiUrl}/add`, report).pipe(
      catchError(this.handleError<Report>('addReport'))
    );
  }

  updateReport(id: number, report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.apiUrl}/${id}`, report).pipe(
      catchError(this.handleError<Report>('updateReport'))
    );
  }

  archiveReport(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/archive`, {}).pipe(
      catchError(this.handleError<void>('archiveReport'))
    );
  }

  deleteReport(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError<void>('deleteReport'))
    );
  }

  // PDF operations
  downloadPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download`, { responseType: 'blob' }).pipe(
      catchError(this.handleError<Blob>('downloadPdf'))
    );
  }

  // Translation operations
  getTranslatedReports(languageCode: string): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.apiUrl}/translated/${languageCode}`).pipe(
      catchError(this.handleError<Report[]>('getTranslatedReports', []))
    );
  }

  getReportTranslated(reportId: number, languageCode: string): Observable<Report> {
    return this.http.get<Report>(`${this.apiUrl}/${reportId}/translated/${languageCode}`).pipe(
      catchError(this.handleError<Report>('getReportTranslated'))
    );
  }

  getTranslation(reportId: number, languageCode: string): Observable<ReportTranslation | null> {
    return this.http.get<ReportTranslation>(`${this.apiUrl}/${reportId}/translations/${languageCode}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        return throwError(() => error);
      })
    );
  }

  addTranslation(reportId: number, translation: ReportTranslation): Observable<ReportTranslation> {
    return this.http.post<ReportTranslation>(
      `${this.apiUrl}/${reportId}/translations`,
      {
        languageCode: translation.languageCode,
        title: translation.title,
        description: translation.description
      }
    ).pipe(
      catchError(this.handleError<ReportTranslation>('addTranslation'))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

// In reports.service.ts
updateReportDate(reportId: number, newDate: Date): Observable<any> {
  // Convert Date to ISO string without timezone adjustment
  const isoString = new Date(newDate.getTime() - (newDate.getTimezoneOffset() * 60000)).toISOString();
  
  return this.http.patch(
    `${this.apiUrl}/${reportId}/date`,
    { generatedDate: isoString },
    {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }
  ).pipe(
    catchError(this.handleError<any>('updateReportDate'))
  );
}
}