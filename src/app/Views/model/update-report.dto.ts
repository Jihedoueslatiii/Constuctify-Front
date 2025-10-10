import { ReportStatus } from "./report.module";

export interface UpdateReportDto {
    title?: string;
    description?: string;
    status?: ReportStatus;
  }