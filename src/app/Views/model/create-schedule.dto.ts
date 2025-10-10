export interface CreateScheduleDto {
  reportId: number;
  command: string;          // Can be either cron expression or natural language command
  recipients?: string;      // Optional comma-separated email list
  timeZone?: string;        // Optional timezone (e.g., 'America/New_York')
  frequency?: string;       // Optional explicit frequency (DAILY, WEEKLY, MONTHLY)
  scheduledTime?: string;   // Optional explicit time (e.g., '15:30' for 3:30 PM)
  startDate?: Date;         // Optional first run date
  isNaturalLanguage?: boolean; // Flag to indicate NLP processing
}