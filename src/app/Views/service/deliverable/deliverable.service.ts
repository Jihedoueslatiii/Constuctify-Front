import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/url/url';
import { Deliverable } from '../../model/deliverable.module';
@Injectable({
  providedIn: 'root'
})
export class DeliverableService {

  private apiUrl: string = Urls.serverpath; // Correction de l'URL

  constructor(private http: HttpClient) {}

  // ✅ Récupérer tous les livrables
  getDeliverables(): Observable<Deliverable[]> {
    return this.http.get<Deliverable[]>(`${this.apiUrl}`);
  }
  getDeliverableById(idDeliverable: number): Observable<Deliverable> {
    return this.http.get<Deliverable>(`${this.apiUrl}/${idDeliverable}`);
  }
  

  createDeliverable(deliverable: Deliverable): Observable<Deliverable> {
    return this.http.post<Deliverable>(`${this.apiUrl}/add`, deliverable);
  }
  

  // ✅ Supprimer un livrable par ID
  deleteDeliverable(idDeliverable: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idDeliverable}`);
  }

  // ✅ Mettre à jour un livrable
  updateDeliverable(idDeliverable: number, deliverable: Deliverable): Observable<any> {
    const url = `${this.apiUrl}/update/${idDeliverable}`;
    console.log("PUT request to:", url); // 🔍 Debug l'URL
    return this.http.put<Deliverable>(url, deliverable, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  
  
} 