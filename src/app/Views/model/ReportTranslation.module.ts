// report-translation.module.ts
export interface ReportTranslation {
    id?: number;
    languageCode: string;
    title: string;
    description: string;
    reportId?: number;
  }