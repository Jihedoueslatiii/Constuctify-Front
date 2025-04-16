import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../model/user.model';
import { Role } from '../../model/user.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089/Constructify/user';
  

  constructor(private http: HttpClient) {}

  getAllUsers(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())   // page actuelle
      .set('size', size.toString());  // nombre d'éléments par page
    return this.http.get<any>(`${this.apiUrl}/all`, { params });
  }

  
  
  registerUser(user: any, showTeamField: boolean = false): Observable<any> {
    const params = new HttpParams().set('showTeamField', showTeamField.toString());
    return this.http.post(`${this.apiUrl}/register`, user, { params });
  }
  
  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }
  getUsersByRole(role: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/getUserByRole/${role}`);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/GetuserById/${id}`);
  }

  updateUserRole(id: number, newRole: string): Observable<User> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.put<User>(
      `${this.apiUrl}/UpdateUserRole/${id}`, 
      JSON.stringify({ role: newRole }), 
      { headers }
    );
  }

  setPassword(token: string, password: string): Observable<any> {
    const payload = { token, password };
    return this.http.post(`${this.apiUrl}/set-password`, payload);
  }
  
   // Affecter un utilisateur à une équipe
   assignUserToTeam(userId: string, teamId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/assign`, { teamId });
  }

  // Désaffecter un utilisateur de son équipe
  unassignUser(userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/unassign`, {});
  }
}
