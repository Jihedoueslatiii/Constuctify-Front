import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from 'src/app/Views/model/task.model'; // Ensure you have a Task model/interface defined

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8089/project/api/tasks'; // Update with your backend URL

  constructor(private http: HttpClient) {}

  // Fetch all tasks
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  // Fetch a task by ID
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  // Create a new task
  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  // Update an existing task
  updateTask(task: Task): Observable<Task> {
    return this.http.put<Task>(this.apiUrl, task);
  }

  // Delete a task
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
// In task.service.ts
// In task.service.ts
// In task.service.ts
assignTaskToProject(taskId: number, projectId: number): Observable<Task> {
  // Construct the correct API URL for assigning a task to a project
  return this.http.put<Task>(`${this.apiUrl}/${taskId}/assign/${projectId}`, {});
}


getTasksByProject(projectId: number): Observable<Task[]> {
  return this.http.get<Task[]>(`${this.apiUrl}/tasks/project/${projectId}`);
}

}