// src/app/models/document.model.ts
export class Document {
  documentId?: number;
  title: string='';
  type?: DocumentType;
  status?: DocumentStatus;
  storagePath?: string;
  content: string='';
  isEditable?: boolean;
  folderId?: number;
  projectId?: number;
  authorId?: number;
  permissions?: string;
  versionNumber?: number;
  previousVersions?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  tags?: string;
  description?: string;
}
export enum DocumentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  TXT = 'TXT',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER'

}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  ARCHIVED = 'ARCHIVED'

}
