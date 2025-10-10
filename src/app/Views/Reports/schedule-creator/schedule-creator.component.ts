// schedule-creator.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReportSchedulerService } from 'src/app/Views/service/Supplier/report-scheduler.service';
import { Report } from 'src/app/Views/model/report.module';
import { CreateScheduleDto } from 'src/app/Views/model/create-schedule.dto';
import { NaturalLanguageCommand } from 'src/app/Views/model/NaturalLanguageCommand.module';

@Component({
  selector: 'app-schedule-creator',
  templateUrl: './schedule-creator.component.html'
})
export class ScheduleCreatorComponent {
  @Input() report!: Report;
  @Output() scheduleCreated = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  useNaturalLanguage = false;

  // Existing form for manual scheduling
  form = this.fb.group({
    command: ['', Validators.required],
    recipients: ['']
  });

  // New form for NLP scheduling
  nlpForm = this.fb.group({
    nlpCommand: ['', Validators.required],
    nlpRecipients: ['']
  });

  constructor(
    private fb: FormBuilder,
    private schedulerService: ReportSchedulerService
  ) {}

  toggleSchedulingMode(): void {
    this.useNaturalLanguage = !this.useNaturalLanguage;
  }

  onSubmit(): void {
    if (this.useNaturalLanguage) {
      this.onSubmitNlp();
    } else {
      this.onSubmitManual();
    }
  }

  onSubmitManual(): void {
    if (this.form.valid) {
      const dto: CreateScheduleDto = {
        reportId: this.report.idReport,
        command: this.form.value.command!,
        recipients: this.form.value.recipients || undefined
      };

      this.schedulerService.createSchedule(dto).subscribe({
        next: () => this.scheduleCreated.emit(),
        error: (err) => console.error('Failed to create schedule', err)
      });
    }
  }

  onSubmitNlp(): void {
    if (this.nlpForm.valid) {
      const command: NaturalLanguageCommand = {
        reportId: this.report.idReport,
        commandText: this.nlpForm.value.nlpCommand!,
        recipients: this.nlpForm.value.nlpRecipients || undefined
      };

      this.schedulerService.createNlpSchedule(command).subscribe({
        next: () => this.scheduleCreated.emit(),
        error: (err) => console.error('Failed to create NLP schedule', err)
      });
    }
  }
}