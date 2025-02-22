import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/url/url';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {

  private apiUrl: string = Urls.serverpath1;

  constructor(private http: HttpClient) {}

  getRessource(): Observable<any[]> {
    let url = this.apiUrl + 'getAllRessources';
    return this.http.get<any[]>(url);  // Retourne un tableau d'objets
  }

  createRessource(Ressource: any): Observable<any> {
    return this.http.post<any>(this.apiUrl + 'add', Ressource);
  }

  deleteRessource(idRessource: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}delete/${idRessource}`);
  }

  updateRessource(idRessource: number, Ressource: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}update/${idRessource}`, Ressource);
  }
}
