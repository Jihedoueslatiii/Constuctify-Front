import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClusterService {
  private apiUrl = 'http://localhost:8092/SupplierContracts/cluster/cluster';

  constructor(private http: HttpClient) {}

  getClusteringResult(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}