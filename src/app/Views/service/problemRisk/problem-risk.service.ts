import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProblemRisk {
  idProblemRisk?: number;
  title: string;
  description: string;
  type: string;          // 'TECHNICAL', 'MANAGEMENT', 'OTHER'
  probability: string;   // 'LOW', 'MEDIUM', 'HIGH'
  problemStatus: string; // 'OPEN', 'IN_PROGRESS', 'RESOLVED'
  detectionDate: Date;   // Stocké en tant que Date
  resolutionDate?: Date; // Optionnel
  appliedSolutions?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemRiskService {

  private baseUrl = 'http://localhost:8089/DeliverableRisk/api/problem-risks';

  constructor(private http: HttpClient) {}

  // ------------------ CRUD ------------------

  getAllProblemRisks(): Observable<ProblemRisk[]> {
    return this.http.get<ProblemRisk[]>(this.baseUrl);
  }

  addProblemRisk(pr: ProblemRisk): Observable<ProblemRisk> {
    return this.http.post<ProblemRisk>(`${this.baseUrl}/add`, pr);
  }

  getProblemRiskById(id: number): Observable<ProblemRisk> {
    return this.http.get<ProblemRisk>(`${this.baseUrl}/${id}`);
  }

  updateProblemRisk(id: number, updated: ProblemRisk): Observable<ProblemRisk> {
    return this.http.put<ProblemRisk>(`${this.baseUrl}/update/${id}`, updated);
  }

  deleteProblemRisk(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }

  // ------------------ Statistiques ------------------

  /**
   * Récupère les statistiques générales des problèmes/risques
   */
  getProblemRiskStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats`);
  }

  /**
   * Récupère les statistiques par type de problème (TECHNICAL, MANAGEMENT, OTHER)
   */
  getProblemRiskByTypeStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/stats/type`);
  }

  /**
   * Récupère les statistiques par probabilité (LOW, MEDIUM, HIGH)
   */
  getStatsByType(): Observable<{ label: string; count: number }[]> {
    return this.http.get<{ label: string; count: number }[]>(`${this.baseUrl}/stats/by-type`);
  }
  getStatsByStatus(): Observable<{ label: string; count: number }[]> {
    return this.http.get<{ label: string; count: number }[]>(`${this.baseUrl}/stats/by-status`);
  }
  
  
}
