import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Schedule } from 'src/app/Views/model/schedule.model'; 

@Component({
  selector: 'app-schedule-list',
  templateUrl: './schedule-list.component.html'
})
export class ScheduleListComponent {
  @Input() schedules: Schedule[] = [];
  @Output() scheduleDeleted = new EventEmitter<number>();
  
  // Implement delete functionality
  onDelete(scheduleId: number): void {
    this.scheduleDeleted.emit(scheduleId);
  }
}