import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import {Teams} from '../../model/teams.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8089/Constructify/user';
  private apiUrl1 = 'http://localhost:8090/PIDEV-equipe/teams';

  constructor(private http: HttpClient) {}

  registerUser(user: any, showTeamField: boolean = false): Observable<any> {
      const params = new HttpParams().set('showTeamField', showTeamField.toString());
      return this.http.post(`${this.apiUrl}/register`, user, { params });
    }

  private showErrorPopup(error: HttpErrorResponse) {
    Swal.fire({
      icon: 'error',
      title: 'Erreur!',
      text: error.error?.message || 'Une erreur est survenue, veuillez réessayer.',
      confirmButtonColor: '#d33'
    });
  }

  getAllTeams(): Observable<Teams[]> {
    return this.http.get<Teams[]>(`${this.apiUrl1}/all`);
  }

  login(email: string, password: string): Observable<any> {
    const credentials = { email, password };
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

}
