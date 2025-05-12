import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Urls } from 'src/app/url/url';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {

    private apiUrl: string = "http://localhost:8087/Finance/api/finances/";
    private apiUrl2: string = "http://localhost:8085/project/projects/";
  
    constructor(private http: HttpClient) {}
  
    getFinance(): Observable<any[]> {
      let url = this.apiUrl + 'getAllFinances';
      return this.http.get<any[]>(url);  // Retourne un tableau d'objets
    }
    createFinance(Finance: any): Observable<any> {
      return this.http.post<any>(this.apiUrl + 'add', Finance);
    }
  
    deleteFinance(financeId: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}delete/${financeId}`);
    }
  
    updateFinance(financeId: number, Finance: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}update/${financeId}`, Finance);
    }
  
    getFinanceById(financeId: number): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}getFinanceById/${financeId}`);
    }
    calculateAndUpdateTotalROI(): Observable<number> {
      return this.http.put<number>(`${this.apiUrl}calculate-and-update-total-roi`, {});
  }
  calculatecost(): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}update-cost/all`, {});
}
assignProjectToFinance(financeId: number, projectId: number): Observable<any> {
  const url = `${this.apiUrl}${financeId}/assign-project/${projectId}`;
  return this.http.post<any>(url, {});
}
sendSmsAlert(to: string): Observable<string> {
  const url = `${this.apiUrl}sendSmsBudget/${to}`;
  return this.http.get<string>(url);  // Changé de POST à GET
}

getAllProjects(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl2 + 'getAllProjets');
}



validerFinance(financeId: number): Observable<any> {
  return this.http.put<any>(`${this.apiUrl}valider/${financeId}`, {}); // 👈 body ajouté
}

}
