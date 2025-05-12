import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FolderService {
  private apiUrl = 'http://localhost:8082/DocumentationManagement/folders';  // Your API URL

  // Inject HttpClient into the constructor
  constructor(private http: HttpClient) {}

  // Get all folders
  getAllFolders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);  // Correct URL to include /all
  }

  createFolder(name: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create?folderName=${encodeURIComponent(name)}`, {});
  }


  // Delete a folder (soft delete)
  deleteFolder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);  // Correct URL for delete
  }



}
