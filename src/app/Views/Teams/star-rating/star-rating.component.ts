import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-star-rating',
  template: `
    <div class="star-rating">
      <span *ngFor="let star of stars" (click)="rate(star)">
        <mat-icon>{{ star <= rating ? 'star' : 'star_border' }}</mat-icon>
      </span>
    </div>
  `,
  styles: [`
    .star-rating {
      display: inline-flex;
      cursor: pointer;
    }
    .star-rating mat-icon {
      color: gold;
    }
  `]
})
export class StarRatingComponent {
  @Input() rating: number = 0; // Note actuelle
  @Output() ratingChange = new EventEmitter<number>(); // Événement pour noter

  stars: number[] = [1, 2, 3, 4, 5]; // Nombre d'étoiles

  rate(star: number): void {
    this.rating = star;
    this.ratingChange.emit(star);
  }
}