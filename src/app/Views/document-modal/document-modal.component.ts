import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-document-modal',
  templateUrl: './document-modal.component.html',
  styleUrls: ['./document-modal.component.css']
})
export class DocumentModalComponent {
  @Input() documentUrl: SafeResourceUrl | undefined;
  @Input() documentType: string | undefined;
  @Input() document: any; // Add this to handle document metadata

  constructor(private sanitizer: DomSanitizer) {}

  getSafeUrl(file: any): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(file);
  }

  closeModal(event?: MouseEvent): void {
    if (!event || event.target === event.currentTarget) {
      this.documentUrl = undefined;
      this.document = undefined; // Clear the document metadata
    }
  }
}
