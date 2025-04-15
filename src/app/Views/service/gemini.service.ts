import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiKey = 'AIzaSyDSyx_3PeP1MTsuizgFxVr7U63WkKR787M'; // Your API Key
  private url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.apiKey}`;

  constructor(private http: HttpClient) {}

  // Use this method to send the prompt to Gemini
  generateContent(prompt: string): Observable<any> {
    const body = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ]
    };

    return this.http.post<any>(this.url, body);
  }
}
