import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from 'src/app/Views/model/project';  // Ensure you have a Project model/interface defined

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:8089/project/api/projets';  // Backend API URL

  constructor(private http: HttpClient) {}

  // Fetch all projects
  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }
  createProject(project: Project): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, project);
  }

  updateProject(idProjet: number, project: Project): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${idProjet}`, project);
  }
  
  deleteProject(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  assignTaskToProject(projectId: number, taskId: number): Observable<any> {
    // Assuming your backend endpoint expects these IDs in the path
    return this.http.post<any>(`${this.apiUrl}/projects/${projectId}/tasks/${taskId}`, {});
  }
  

}
