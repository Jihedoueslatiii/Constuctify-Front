import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Timesheet } from '../model/Timesheet ';

@Injectable({
  providedIn: 'root',
})
export class TimesheetService {
  private timesheetsKey = 'timesheets'; // Key for localStorage
  private timesheetsSubject: BehaviorSubject<Timesheet[]> = new BehaviorSubject<Timesheet[]>([]);

  constructor() {
    // Load timesheets from localStorage on service initialization
    const savedTimesheets = localStorage.getItem(this.timesheetsKey);
    if (savedTimesheets) {
      this.timesheetsSubject.next(JSON.parse(savedTimesheets));
    }
  }

  // Get all timesheets as an observable
  getTimesheets(): Observable<Timesheet[]> {
    return this.timesheetsSubject.asObservable();
  }

  // Log a new timesheet
  logTimesheet(timesheet: Timesheet): void {
    const currentTimesheets = this.timesheetsSubject.value;
    const updatedTimesheets = [...currentTimesheets, timesheet];
    this.timesheetsSubject.next(updatedTimesheets);

    // Save to localStorage
    localStorage.setItem(this.timesheetsKey, JSON.stringify(updatedTimesheets));
  }

  // Clear all timesheets (optional)
  clearTimesheets(): void {
    this.timesheetsSubject.next([]);
    localStorage.removeItem(this.timesheetsKey);
  }
}