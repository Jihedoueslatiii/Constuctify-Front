import { ReportStatus } from './report.module';
import { ScheduleConfig } from './schedule-config.model';


export interface ScheduleLog {
  idLog: number;
  schedule: ScheduleConfig;
  runTime: string; // ISO string format
  status: ReportStatus;
  errorMessage?: string;
  reportPath?: string;
}