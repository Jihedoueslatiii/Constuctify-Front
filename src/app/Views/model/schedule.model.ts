export interface Schedule {
    id: number;
    reportId: number;
    frequency: string;
    nextRun: Date | string;
    recipients: string;
  }