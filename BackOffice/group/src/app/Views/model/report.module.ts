export enum ReportType {
    CONTRACT_SUMMARY = 'CONTRACT_SUMMARY',
    SUPPLIER_PERFORMANCE = 'SUPPLIER_PERFORMANCE',
    EXPIRING_CONTRACTS = 'EXPIRING_CONTRACTS'
  }
  
  export enum ReportStatus {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    ARCHIVED = 'ARCHIVED'
  }
  
  export interface Report {
    idReport: number;
    title: string;
    description: string;
    reportType: ReportType;
    generatedDate: string; 
    lastUpdated: string;
    status: ReportStatus;
    filePath: string;
  }
  
  