import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private baseUrl = 'http://localhost:8088/DocumentationManagement/documents';
  constructor(private http: HttpClient) {}

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/upload`, formData);
}

  getAllDocuments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/get-project-documents/1`); // Replace `1` with actual project ID
  }

  deleteDocument(documentId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete-document/${documentId}`);
  }

  getRecentFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/recent-files`); // Assuming this endpoint is correct
  }

  getDocumentsByFolder(folderId: number): Observable<any[]> {
    console.log("getDocumentsByFolder called with folderId:", folderId);
    return this.http.get<any[]>(`${this.baseUrl}/get-documents-by-folder/${folderId}`); // Corrected line
}

updateDocument(documentId: number, formData: FormData): Observable<any> {
  return this.http.put(`${this.baseUrl}/update-document/${documentId}`, formData);
}

searchDocuments(query: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/search?query=${query}`);
}

// Add these methods to your DocumentService
createDocumentWithContent(document: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/create-document-with-content`, document);
}

updateDocumentContent(documentId: number, content: string): Observable<any> {
  return this.http.put(`${this.baseUrl}/update-document-content/${documentId}`, { content });
}

// Add this method to your DocumentService
getDocumentById(documentId: number): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/get-document/${documentId}`);
}

// Add this method to your DocumentService
createDocument(document: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/create-document`, document);
}

updateDocumentMetadata(documentId: number, formData: FormData): Observable<any> {
  return this.http.post(`${this.baseUrl}/updateDocumentFormData/${documentId}`, formData);
}

  // Add this method for HTML to PDF conversion
  htmlToPdf(htmlContent: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/html-to-pdf`, htmlContent);
  }

  generatePdf(htmlContent: string): Observable<Blob> {
    return this.http.post(this.baseUrl, htmlContent, { responseType: 'blob' });
  }
}
