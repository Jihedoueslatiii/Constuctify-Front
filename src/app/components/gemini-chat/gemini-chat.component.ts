import { Component } from '@angular/core';
import { GeminiService } from 'src/app/Views/service/gemini.service';

@Component({
  selector: 'app-gemini-chat',
  templateUrl: './gemini-chat.component.html',
  styleUrls: ['./gemini-chat.component.css']
})
// In gemini-chat.component.ts
export class GeminiChatComponent {
  prompt = '';
  response = '';
  isLoading = false;

  constructor(private geminiService: GeminiService) {}

  askGemini() {
    if (!this.prompt.trim()) return;
    
    this.isLoading = true;
    this.response = ''; // Clear previous response
  
    this.geminiService.generateContent(this.prompt).subscribe({
      next: (res) => {
        console.log('API Response:', res);
  
        if (res?.candidates && res.candidates[0]?.content?.parts?.[0]?.text) {
          this.response = res.candidates[0].content.parts[0].text;
        } else {
          this.response = 'No valid response from Gemini';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('API Error:', err);
        this.response = 'Error occurred while contacting Gemini API: ' + (err.error?.error?.message || err.message);
        this.isLoading = false;
      }
    });
  }
}