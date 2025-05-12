import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private apiUrl = 'http://127.0.0.1:8000/predict';

  constructor(private http: HttpClient) {}

  getPrediction(data: any): Observable<{ prediction: number }> {
    return this.http.post<{ prediction: number }>(this.apiUrl, data);
  }
}
