export interface ReportTranslation {
    idTranslation?: number;
    languageCode: string; // e.g., 'en', 'fr'
    title: string;
    description: string;
    // No need for Report reference if using embedded in Report
  }