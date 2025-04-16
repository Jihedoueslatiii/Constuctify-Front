import { Injectable } from '@angular/core';
import { HttpClient,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  private apiUrl = 'http://localhost:8089/Constructify/user'; // Ton endpoint backend

  constructor(private http: HttpClient) {}


  getAuditLogs(page: number, size: number): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(`${this.apiUrl}/logs`, { params });
  }
}
