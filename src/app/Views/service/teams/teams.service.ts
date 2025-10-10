import { Injectable } from '@angular/core';
import { Teams } from '../../model/teams.model';
import { User } from '../../model/user.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private apiUrl = 'http://localhost:8090/PIDEV-equipe/teams';
  private apiUrl2 = 'http://localhost:8090/PIDEV-equipe/api/ratings';
  private apiUrl1 = 'http://localhost:8089/Constructify/user';

  constructor(private http: HttpClient) {}

  // Ajouter une équipe
  addTeam(team: Teams): Observable<Teams> {
    return this.http.post<Teams>(`${this.apiUrl}/create`, team).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle the error response
        let errorMessage = 'Erreur lors de l\'ajout de l\'équipe';
        if (error.status === 400 && error.error) {
          errorMessage = error.error; // Use the error message from the backend
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

registerUser(user: User): Observable<User> {
  return this.http.post<User>(`${this.apiUrl1}/register`, user);
}

getAllTeams(): Observable<Teams[]> {
  return this.http.get<Teams[]>(`${this.apiUrl}/all`);
}

getAllTeams2(page: number, pageSize: number): Observable<{ content: Teams[], totalElements: number }> {
  return this.http.get<{ content: Teams[], totalElements: number }>(`${this.apiUrl}/paginationTeams`, {
    params: {
      page: page.toString(),
      pageSize: pageSize.toString()
    }
  }).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Erreur lors de la récupération des équipes:', error);
      return throwError(() => new Error('Erreur de récupération des équipes'));
    })
  );
}

getUsersByTeam(teamId: number): Observable<User[]> {
  return this.http.get<User[]>(`${this.apiUrl1}/byTeam/${teamId}`);
}

updateTeamName(teamId: number, newName: string): Observable<any> {
  return this.http.patch(`${this.apiUrl}/teams/${teamId}`, { teamName: newName });
}

removeEmployeeFromTeams(teamId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/${teamId}/removeEmployee/${teamId}`);
}

deleteTeam(teamId: number): Observable<any> {
  return this.http.delete(`${this.apiUrl}/Delete/${teamId}`);
}

getTeamById(teamId: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/FindTeam/${teamId}`);
}


addRating(userId: number, teamId: number, ratingValue: number): Observable<void> {
  const url = `${this.apiUrl2}/${teamId}/ratings`; // Correct endpoint
  const body = { userId, ratingValue }; // Send userId and ratingValue in the request body
  return this.http.post<void>(url, body);
}

// Récupérer la moyenne des notes d'une équipe
getAverageRating(teamId: number): Observable<number> {
  const url = `${this.apiUrl2}/${teamId}/average`; // Correct endpoint
  return this.http.get<number>(url);
}

getTeamWithRatings(teamId: number): Observable<Teams[]> {
  const url = `${this.apiUrl}/FindTeam/${teamId}`;
  return this.http.get<Teams[]>(url);
}

getUserRatings(userId: number): Observable<any[]> {
  const url = `${this.apiUrl2}/user/${userId}`;
  return this.http.get<any[]>(url);
}

// teams.service.ts
suggestTeamName(): Observable<string> {
  const url = `${this.apiUrl}/suggest-name`;
  return this.http.get(url, { responseType: 'text' });
} 

// Retirer un employé d'une équipe
removeEmployeeFromTeam(teamId: number, employeeId: number): Observable<any> {
  const url = `${this.apiUrl}/${teamId}/removeEmployee/${employeeId}`;
  return this.http.delete<any>(url).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Erreur lors du retrait de l\'employé de l\'équipe';
      if (error.status === 400 && error.error) {
        errorMessage = error.error; // Utiliser le message d'erreur du backend
      }
      return throwError(() => new Error(errorMessage));
    })
  );
}

assignEmployeeToTeam(employeeId: number, teamId: number): Observable<void> {
  return this.http.put<void>(`${this.apiUrl1}/${employeeId}/assign-team/${teamId}`, {});
}


}
