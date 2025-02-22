import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Timesheet } from '../model/Timesheet ';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private baseUrl = 'http://localhost:3000/api/tasks'; // Adjust URL as per your backend

  constructor(private http: HttpClient) { }

  logTimesheet(taskId: number, timesheet: Timesheet): Observable<Timesheet> {
    return this.http.post<Timesheet>(`${this.baseUrl}/${taskId}/timesheet`, timesheet);
  }
}
