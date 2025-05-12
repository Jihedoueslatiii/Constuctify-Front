import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSource = new Subject<string>();
  searchTerm$ = this.searchTermSource.asObservable();

  updateSearchTerm(searchTerm: string): void {
    this.searchTermSource.next(searchTerm);
  }
}
