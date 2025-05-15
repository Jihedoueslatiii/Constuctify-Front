import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8089/Constructify/user';

  constructor(private http: HttpClient, private router: Router) {}

  // Connexion utilisateur
  login(credentials: any) {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap((response) => {
        if (response && response.user) {
          localStorage.setItem('adminUser', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
  
          // Déterminer l'URL de redirection en fonction du rôle
          const redirectUrl = response.user.role === 'Admin'
            ? `/user-list?token=${response.token}&userId=${response.user.id}&role=${response.user.role}`
            : `/dashboard?token=${response.token}&userId=${response.user.id}&role=${response.user.role}`;
  
          // Rediriger avec Angular Router
          this.router.navigate([redirectUrl]);
        }
      })
    );
  }
  getUserById(id: number) {
    const token = localStorage.getItem('token'); // Récupérer le token du localStorage
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/user/GetuserById/${id}`, { headers });
  }

  // Vérifie la session active
  getSession() {
    return this.http.get(`${this.apiUrl}/session`, { withCredentials: true });
  }

  // Déconnexion utilisateur
  logout() {
    // Efface le token de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true, responseType: 'text' });  // Indiquer que la réponse est du texte
  }

  // Vérifie si l'utilisateur est connecté
  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  
}
