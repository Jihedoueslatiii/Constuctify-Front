import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/url/url';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RessourceService {

  private apiUrl: string = Urls.serverpath1;
  private apiUrl2: string = Urls.serverpath2;


  constructor(private http: HttpClient) {}
  //donne tous les informatio d'un projet
  getProjetById(idProjet: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl2}projet/${idProjet}`);
  }
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

  getRessourceById(idRessource: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}getRessourceby/${idRessource}`);
  }
  
 /* 
 assignResourceToProject(resourceId: number, projectId: number): Observable<any> {
    const url = `${this.apiUrl}affecter/${resourceId}/${projectId}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.request('POST', url, { body: "{}", headers, responseType: 'text' });
  }nombreRessource
  */
  assignResourceToProject(resourceId: number, projectId: number, nombreRessource:number): Observable<string> {
    const url = `${this.apiUrl.replace(/\/$/, '')}/affecter/${resourceId}/${projectId}/${nombreRessource}`;
    return this.http.post(url, {}, { responseType: 'text' }); // Indiquer que la réponse est du texte
}
sendRessourceReport(destinataire: string): Observable<string> {
  const url = `${this.apiUrl}envoyerRapport/${destinataire}`;
  return this.http.post(url, {}, { responseType: 'text' });
}
  //historique ressource
  getProjectsForRessource(id: number): Observable<any> {
    //return this.http.get(`${this.apiUrl}/${id}/projects`);
    return this.http.get<any>(`${this.apiUrl}${id}/projects`);
  }
  sendsms(telephone: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}sendSms2/${telephone}`);
  }
  
}
