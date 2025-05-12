import { Component, Output, EventEmitter } from '@angular/core';
import { DocumentService } from '../service/Documentation/document.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contract-editor',
  templateUrl: './contract-editor.component.html',
  styleUrls: ['./contract-editor.component.css']
})
export class ContractEditorComponent {

  @Output() saveContract = new EventEmitter<string>();
  editorContent = `
    <h1>Contract Agreement</h1>
    <p>This Contract Agreement is made and entered into this <span contenteditable="true" (click)="selectPlaceholder($event)">{{contractDate}}</span> by and between:</p>
    <p><strong><span contenteditable="true" (click)="selectPlaceholder($event)">{{clientName}}</span></strong>, residing at <span contenteditable="true" (click)="selectPlaceholder($event)">{{clientAddress}}</span>, (hereinafter referred to as "Client")</p>
    <p>AND</p>
    <p><strong>[Your Company Name]</strong>, with a principal place of business at [Your Company Address], (hereinafter referred to as "Company")</p>
    <h2>1. Services</h2>
    <p>Company agrees to provide the following services to Client (the "Services"):</p>
    <ul>
      <li><span contenteditable="true" (click)="selectPlaceholder($event)">{{service1}}</span></li>
      <li><span contenteditable="true" (click)="selectPlaceholder($event)">{{service2}}</span></li>
    </ul>
  `;

  editorInit = {
    height: 500,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview', 'anchor',
      'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | formatselect | bold italic backcolor | \
              alignleft aligncenter alignright alignjustify | \
              bullist numlist outdent indent | removeformat | help'
  };

  placeholderInput: string = '';
  selectedPlaceholder: HTMLElement | null = null;
  documentId: number | null = null;
  pdfError = false;

  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.documentId = +this.route.snapshot.paramMap.get('documentId')!;
    if (this.documentId) {
      this.loadDocument();
    }
  }

  loadDocument(): void {
    if (this.documentId) {
      this.documentService.getDocumentById(this.documentId).subscribe(
        (document) => {
          this.editorContent = document.content || '';
        },
        (error) => {
          console.error('Error loading document:', error);
        }
      );
    }
  }

  selectPlaceholder(event: MouseEvent): void {
    this.selectedPlaceholder = event.target as HTMLElement;
    this.placeholderInput = this.selectedPlaceholder.textContent || '';
  }

  updatePlaceholder(): void {
    if (this.selectedPlaceholder) {
      this.selectedPlaceholder.textContent = this.placeholderInput;
    }
  }

  save(): void {
    this.saveContract.emit(this.editorContent);
    if (this.documentId) {
      const updatedDocument = {
        documentId: this.documentId,
        content: this.editorContent
      };
      this.documentService.createDocumentWithContent(updatedDocument).subscribe(
        (response) => {
          console.log('Document updated:', response);
          this.router.navigate(['/listDocuments']);
        },
        (error) => {
          console.error('Error updating document:', error);
        }
      );
    } else {
      const newDocument = {
        title: 'New Document',
        type: 'TXT',
        status: 'DRAFT',
        tags: [],
        description: 'Document created with TinyMCE editor',
        content: this.editorContent
      };
      this.documentService.createDocumentWithContent(newDocument).subscribe(
        (response) => {
          console.log('Document created:', response);
          this.router.navigate(['/listDocuments']);
        },
        (error) => {
          console.error('Error creating document:', error);
        }
      );
    }
    this.generateAndDownloadPdf();
  }

  generateAndDownloadPdf(): void {
    this.pdfError = false;
    this.documentService.generatePdf(this.editorContent).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contract.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error('Error generating PDF:', error);
        this.pdfError = true;
      }
    );
  }

  cancelEditor(): void {
    this.router.navigate(['/listDocuments']);
  }
}
