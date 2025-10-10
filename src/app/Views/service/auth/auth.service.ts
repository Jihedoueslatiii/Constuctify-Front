import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';  // Importer Observable pour spécifier le type de retour
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/Constructify/user';
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser$: Observable<any>;

  constructor(private http: HttpClient) {
    // Initialize the BehaviorSubject with the user data from localStorage (if exists)
    this.currentUserSubject = new BehaviorSubject<any>(
      JSON.parse(localStorage.getItem('authData') || 'null')?.user
    );
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  // Method to get current user information (same logic as getCurrentUser)
  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('authData') || 'null')?.user;
  }


  // Connexion utilisateur
  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response) => {
        if (response && response.token) {
          // Stocke l'utilisateur connecté et le token dans localStorage
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);  // Stocke le token pour l'authentification
        }
      })
    );
  }

  // Déconnexion utilisateur
  logout() {
    // Efface le token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    sessionStorage.clear();
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true, responseType: 'text' });  // Indiquer que la réponse est du texte
  }

  // Récupérer les détails de l'utilisateur avec le token
  getUserDetails(token: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Vérifie si un utilisateur est authentifié
  isAuthenticated(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Récupérer le token depuis localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getSession() {
    return this.http.get(`${this.apiUrl}/session`, { withCredentials: true });
  }

// In your AuthService
getUserInfo(): any {
  const user = localStorage.getItem('adminUser'); // Changed key to 'adminUser'
  return user ? JSON.parse(user) : null;
}



}
