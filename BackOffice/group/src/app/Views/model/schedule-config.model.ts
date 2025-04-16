export interface ScheduleConfig {
  idSchedule: number;
  report: Report;
  recipients: string;
  cronExpression: string;
  nextRunTime: string; // ISO string format
  lastRunTime?: string; // ISO string format
  active: boolean;
  timeZone: string;
  // Add any additional fields from your backend
}