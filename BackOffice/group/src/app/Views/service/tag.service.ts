import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private availableTags = new BehaviorSubject<string[]>([
    'Legal', 'Finance', 'Renewal', 'Vendor', 
    'Contract', 'Performance', 'Quarterly', 'Monthly'
  ]);
  
  private selectedTags = new BehaviorSubject<string[]>([]);

  getAvailableTags(): Observable<string[]> {
    return this.availableTags.asObservable();
  }

  getSelectedTags(): Observable<string[]> {
    return this.selectedTags.asObservable();
  }

  addTag(tag: string): void {
    if (!this.selectedTags.value.includes(tag)) {
      this.selectedTags.next([...this.selectedTags.value, tag]);
    }
  }

  removeTag(tag: string): void {
    this.selectedTags.next(this.selectedTags.value.filter(t => t !== tag));
  }

  createNewTag(tag: string): void {
    if (!this.availableTags.value.includes(tag)) {
      this.availableTags.next([...this.availableTags.value, tag]);
    }
    this.addTag(tag);
  }

  clearTags(): void {
    this.selectedTags.next([]);
  }
}