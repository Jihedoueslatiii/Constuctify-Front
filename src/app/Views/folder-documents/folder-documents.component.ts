// folder-documents.component.ts
import { DomSanitizer } from '@angular/platform-browser';
import { FolderService } from './../service/Folders/folder.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, AfterViewInit  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from '../service/Documentation/document.service';
import { SafeResourceUrl } from '@angular/platform-browser';
import { DocumentModalComponent } from '../document-modal/document-modal.component';

@Component({
    selector: 'app-folder-documents',
    templateUrl: './folder-documents.component.html',
    styleUrls: ['./folder-documents.component.css']
})
export class FolderDocumentsComponent implements OnInit, AfterViewInit  {
    folderId?: number;
    documents: any[] = [];
    originalDocuments: any[] = [];
    selectedDocumentUrl: SafeResourceUrl | undefined;
    selectedDocumentTitle: string | undefined;
    showUploadForm = false;
    editingDocument: any | null = null;
    showConfirmation = true;
    documentToDeleteId: number | null = null;
    showDocumentList = true;
    searchQuery: string = '';
    searchTerm = '';
    searchResults: any;
    selectedDocument: any;
    showDocumentViewer: boolean = false;
    documentToView: any = null;
    documentUrl: SafeResourceUrl | undefined;
    documentType: string | undefined;
    @ViewChild('documentModal') documentModal!: DocumentModalComponent;

    constructor(
        private route: ActivatedRoute,
        private documentService: DocumentService,
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
      const folderIdParam = this.route.snapshot.paramMap.get('folderId');
      if (folderIdParam) {
          this.folderId = +folderIdParam;
          this.loadDocuments();
      } else {
          console.error('Folder ID is missing!');
      }
  }

  ngAfterViewInit(): void {
      console.log('ngAfterViewInit - documentModal:', this.documentModal); // Debugging
      if (this.selectedDocument && this.documentModal) {
          this.documentModal.document = this.selectedDocument;
      }
  }

  viewDocument(document: any): void {
    this.documentToView = document;
    this.documentType = document.type;

    if (document.documentId) {
        const fileUrl = `http://localhost:8088/DocumentationManagement/documents/view-file/${document.documentId}`;
        this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
    } else if (document.content) {
        this.documentUrl = undefined; // Handle text content directly
    }

    this.showDocumentViewer = true;
}


closeDocumentViewer(event?: MouseEvent): void {
        if (!event || event.target === event.currentTarget) {
            this.showDocumentViewer = false;
            this.documentToView = null;
            this.documentUrl = undefined;
        }
    }


  openDocument(document: any): void {
      console.log('openDocument - document:', document); // Debugging
      console.log('openDocument - documentModal:', this.documentModal); // Debugging
      this.selectedDocument = document;
      this.selectedDocumentUrl = document.safeUrl;
      if (this.documentModal) {
          this.documentModal.document = document;
      }
      this.cdr.detectChanges();
  }
    showContractEditor = false; // New property

    // Existing methods

    openContractEditor(): void {
      this.showContractEditor = true;
    }

    closeContractEditor(): void {
      this.showContractEditor = false;
    }

    saveContract(contractContent: string): void { // Correct type
      if (this.folderId === undefined) {
          console.error('Folder ID is missing!');
          return;
      }

      const formData = new FormData();
      formData.append('title', 'Contract Agreement');
      formData.append('type', 'PDF');
      formData.append('status', 'DRAFT');
      formData.append('content', contractContent); // Use the received content
      formData.append('folderId', this.folderId.toString());

      this.documentService.uploadDocument(formData).subscribe(() => {
          this.closeContractEditor();
          this.loadDocuments();
      });
  }


    searchDocuments(): void {
      if (this.searchTerm.trim() !== '') {
        this.documentService.searchDocuments(this.searchTerm).subscribe(
          results => {
            this.searchResults = results;
          },
          error => {
            console.error('Error searching documents:', error);
            // Handle error (e.g., display an error message to the user)
          }
        );
      } else {
        this.searchResults = []; // Correctly assign an empty array
      }
    }




    loadDocuments(): void {
        if (this.folderId !== undefined) {
            this.documentService.getDocumentsByFolder(this.folderId).subscribe(documents => {
                if (documents && Array.isArray(documents)) {
                    this.originalDocuments = documents.map(doc => {
                        const safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                            'http://localhost:8088/DocumentationManagement/documents/view-file/' + doc.documentId
                        );
                        return {
                            ...doc,
                            safeUrl: safeUrl
                        };
                    });
                    this.documents = [...this.originalDocuments];
                } else {
                    this.documents = [];
                    this.originalDocuments = [];
                }
            }, error => {
                console.log("error: ", error);
            });
        }
    }

    getFilteredDocuments(): any[] {
        if (!this.searchQuery) {
            return this.documents;
        }
        return this.documents.filter(doc => {
            return doc.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                   doc.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                   doc.tags.toLowerCase().includes(this.searchQuery.toLowerCase());
        });
    }



    closeModal(): void {
        this.selectedDocumentUrl = undefined;
    }

    openUploadForm(): void {
        this.showUploadForm = true;
    }

    onUploadComplete(): void {
        this.showUploadForm = false;
        this.editingDocument = null;
        this.loadDocuments();
    }

    onUploadCancel(): void {
        this.showUploadForm = false;
        this.editingDocument = null;
    }

    editDocument(document: any): void {
        this.editingDocument = { ...document };
        this.showUploadForm = true;
    }

    deleteDocument(documentId: number): void {
      console.log('Deleting document with ID:', documentId);
      this.documentService.deleteDocument(documentId).subscribe(
          () => {
              console.log('Delete successful');
              // Refresh the document list
              this.loadDocuments();
          },
          (error) => {
              console.error('Delete failed:', error);
              // Handle error (e.g., display an error message to the user)
          }
      );
  }

    confirmDelete(): void {
        if (this.documentToDeleteId !== null) {
            this.documentService.deleteDocument(this.documentToDeleteId).subscribe(() => {
                this.showDocumentList = false;
                setTimeout(() => {
                    this.loadDocuments();
                    this.showDocumentList = true;
                    this.closeConfirmation();
                    this.cdr.detectChanges();
                }, 10);
            });
        }
    }

    closeConfirmation(): void {
        this.showConfirmation = false;
        this.documentToDeleteId = null;
    }



}


