// schedule-dialog.component.ts
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Report } from 'src/app/Views/model/report.module'; 
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedule-dialog',
  template: `
    <h2 mat-dialog-title>Schedule {{data.report.title}}</h2>
    <div mat-dialog-content>
      <form [formGroup]="scheduleForm">
        <mat-form-field appearance="outline" class="w-full">
          <textarea matInput formControlName="command" 
                   placeholder="Type schedule like 'Every Monday at 9am'"></textarea>
        </mat-form-field>
        <mat-form-field appearance="outline" class="w-full">
          <input matInput formControlName="recipients" 
                 placeholder="Recipients (comma separated)">
        </mat-form-field>
      </form>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-raised-button color="primary" 
              (click)="onSchedule()" [disabled]="!scheduleForm.valid">
        Schedule
      </button>
    </div>
  `
})
export class ScheduleDialogComponent {
  scheduleForm = this.fb.group({
    command: ['', Validators.required],
    recipients: ['']
  });

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { report: Report }
  ) {}

  onSchedule(): void {
    this.dialogRef.close(this.scheduleForm.value);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}