import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NgrokService {
  private currentUrl = '';

  setNgrokUrl(url: string) {
    this.currentUrl = url;
    localStorage.setItem('currentNgrokUrl', url);
  }

  getNgrokUrl(): string {
    return this.currentUrl || localStorage.getItem('currentNgrokUrl') || '';
  }
}