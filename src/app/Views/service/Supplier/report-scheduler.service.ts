// report-scheduler.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateScheduleDto } from '../../model/create-schedule.dto';
import { Schedule } from '../../model/schedule.model';
import { NaturalLanguageCommand } from '../../model/NaturalLanguageCommand.module';
@Injectable({
  providedIn: 'root'
})
export class ReportSchedulerService {
  private apiUrl = 'http://localhost:8080/api/schedules';

  constructor(private http: HttpClient) { }

  // Existing methods
  createSchedule(dto: CreateScheduleDto): Observable<Schedule> {
    return this.http.post<Schedule>(this.apiUrl, dto);
  }

  getSchedulesForReport(reportId: number): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(`${this.apiUrl}/report/${reportId}`);
  }

  cancelSchedule(scheduleId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${scheduleId}`);
  }

  // New method for NLP scheduling
  createNlpSchedule(command: NaturalLanguageCommand): Observable<Schedule> {
    return this.http.post<Schedule>(`${this.apiUrl}/nlp`, command);
  }
}