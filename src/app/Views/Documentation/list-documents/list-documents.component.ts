import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentService } from '../../service/Documentation/document.service';
import { FolderService } from '../../service/Folders/folder.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Import DomSanitizer
import { DocumentUploadFormComponent } from '../../document-upload-form/document-upload-form.component';
@Component({
  selector: 'app-list-documents',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.css']
})
export class ListDocumentsComponent implements OnInit {

  folders: any[] = [];
  recentFiles: any[] = [];
  generalDocuments: any[] = [];
  isFolderFormOpen = false;
  isDocumentFormOpen = false;
  isEditDocumentFormOpen = false;
  newFolderName = '';

  // Document Upload Form
  uploadForm: FormGroup;
  editForm: FormGroup;
  selectedDocument: any;

  // Confirmation Modal
  showConfirmationModal: boolean = false;
  itemToDelete: { id: number; type: 'folder' | 'document' } | null = null;

  // Document Viewer Properties
  showDocumentViewer: boolean = false;
  documentToView: any = null;
  documentUrl: SafeResourceUrl | undefined;
  documentType: string | undefined;

  constructor(
    private fb: FormBuilder,
    private folderService: FolderService,
    private documentService: DocumentService,
    private router: Router,
    private sanitizer: DomSanitizer // Add DomSanitizer for URL sanitization
  ) {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      type: ['PDF', Validators.required],
      status: ['DRAFT', Validators.required],
      tags: ['', Validators.required],
      description: ['', Validators.required],
      file: [null]
    });

    this.editForm = this.fb.group({
      title: ['', Validators.required],
      type: ['PDF', Validators.required],
      status: ['DRAFT', Validators.required],
      tags: ['', Validators.required],
      description: ['', Validators.required],
      file: [null]
    });
  }

  ngOnInit() {
    this.loadFolders();
    this.loadRecentFiles();
    this.loadGeneralDocuments();
  }

  // Load folders from the service
  loadFolders() {
    this.folderService.getAllFolders().subscribe(folders => {
      this.folders = folders;
    });
  }

  // Load recent files from the service
  loadRecentFiles() {
    this.documentService.getRecentFiles().subscribe(files => {
      this.recentFiles = files.map(file => ({
        documentId: file.documentId, // Ensure this is included
        name: file.title,
        date: file.createdAt ? new Date(file.createdAt).toLocaleDateString() : 'N/A',
        tags: file.tags ? file.tags.split(',') : [],
        version: file.versionNumber || 1,
        status: file.status || 'UNKNOWN',
        type: file.type || 'PDF', // Ensure this is included
        content: file.content || null, // Optional, for text files
        file: file.storagePath ? { name: file.storagePath.split('/').pop() } : null // Optional, for file paths
      }));
    });
  }

  // Load general documents from the service
  loadGeneralDocuments() {
    this.documentService.getDocumentsByFolder(0).subscribe(documents => {
      this.generalDocuments = documents.map(doc => ({
        documentId: doc.documentId,
        title: doc.title,
        type: doc.type,
        status: doc.status,
        tags: doc.tags ? doc.tags.split(',') : [],
        description: doc.description,
        file: doc.storagePath ? { name: doc.storagePath.split('/').pop() } : null,
        content: doc.content // Add content for text files
      }));
    });
  }

  // Open the folder form
  openFolderForm() {
    this.isFolderFormOpen = true;
  }

  // Close the folder form
  closeFolderForm() {
    this.isFolderFormOpen = false;
  }

  // Add a new folder
  addFolder() {
    this.folderService.createFolder(this.newFolderName).subscribe(folder => {
      this.folders.push(folder);
      this.closeFolderForm();
    });
  }

  // Open the confirmation modal
  openConfirmationModal(id: number, type: 'folder' | 'document') {
    this.itemToDelete = { id, type };
    this.showConfirmationModal = true;
  }

  // Handle confirmation
  onConfirmDelete() {
    if (this.itemToDelete) {
      if (this.itemToDelete.type === 'folder') {
        this.folderService.deleteFolder(this.itemToDelete.id).subscribe(() => {
          this.folders = this.folders.filter(folder => folder.folderId !== this.itemToDelete?.id);
          this.showConfirmationModal = false;
        });
      } else if (this.itemToDelete.type === 'document') {
        this.documentService.deleteDocument(this.itemToDelete.id).subscribe(() => {
          this.generalDocuments = this.generalDocuments.filter(
            doc => doc.documentId !== this.itemToDelete?.id
          );
          this.showConfirmationModal = false;
        });
      }
    }
  }

  // Handle cancellation
  onCancelDelete() {
    this.showConfirmationModal = false;
    this.itemToDelete = null;
  }

  // Navigate to a specific folder
  goToFolder(folderId: number): void {
    this.router.navigate(['/folders', folderId]);
  }

  // Open the document form
  openDocumentForm() {
    this.isDocumentFormOpen = true;
    this.uploadForm.reset();
  }

  // Close the document form
  closeDocumentForm() {
    this.isDocumentFormOpen = false;
    this.uploadForm.reset();
  }

  // Handle file input change
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadForm.patchValue({ file });
    }
  }

  // Submit the document upload form
  onSubmit() {
    if (this.uploadForm.invalid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', this.uploadForm.value.title);
    formData.append('type', this.uploadForm.value.type);
    formData.append('status', this.uploadForm.value.status);
    formData.append('tags', this.uploadForm.value.tags);
    formData.append('description', this.uploadForm.value.description);
    formData.append('folderId', '0');

    if (this.uploadForm.value.file) {
      formData.append('file', this.uploadForm.value.file);
    }

    this.documentService.uploadDocument(formData).subscribe(
      (response) => {
        this.generalDocuments.push(response);
        this.closeDocumentForm();
      },
      (error) => {
        console.error('Error uploading document:', error);
      }
    );
  }

  // View a document
viewDocument(document: any): void {
  this.documentToView = document;
  this.documentType = document.type;

  // Construct the full URL to the file using the documentId
  if (document.documentId) {
    const fileUrl = `http://localhost:8088/DocumentationManagement/documents/view-file/${document.documentId}`;
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileUrl);
  } else if (document.content) {
    this.documentUrl = undefined; // Handle text content directly
  }

  this.showDocumentViewer = true;
}

  // Close the document viewer
// Close the document viewer
closeDocumentViewer(event?: MouseEvent): void {
  if (!event || event.target === event.currentTarget) {
    this.showDocumentViewer = false;
    this.documentToView = null;
    this.documentUrl = undefined;
  }
}

  // Open the edit document form
  openEditDocumentForm(document: any) {
    this.selectedDocument = document;
    this.isEditDocumentFormOpen = true;
    this.editForm.patchValue({
      title: document.title,
      type: document.type,
      status: document.status,
      tags: document.tags.join(','),
      description: document.description
    });
  }

  // Close the edit document form
  closeEditDocumentForm() {
    this.isEditDocumentFormOpen = false;
    this.editForm.reset();
  }

  // Handle file input change for edit form
  onEditFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editForm.patchValue({ file });
    }
  }

  // Submit the edit document form
 // Submit the edit document form
// Submit the edit document form
onEditSubmit() {
  if (this.editForm.invalid) {
      return;
  }

  const documentId = this.selectedDocument.documentId;
  if (!documentId) {
      console.error('Document ID is undefined');
      return;
  }

  const formData = new FormData();
  formData.append('title', this.editForm.value.title);
  formData.append('type', this.editForm.value.type);
  formData.append('status', this.editForm.value.status);
  formData.append('tags', this.editForm.value.tags);
  formData.append('description', this.editForm.value.description);

  if (this.editForm.value.file) {
      formData.append('file', this.editForm.value.file);
  }

  this.documentService.updateDocumentMetadata(documentId, formData).subscribe(
      (response) => {
          const index = this.generalDocuments.findIndex(doc => doc.documentId === documentId);
          if (index !== -1) {
              this.generalDocuments[index] = response;
          }
          this.closeEditDocumentForm();
      },
      (error) => {
          console.error('Error updating document:', error);
      }
  );
}


// Add this method to your component
createDocumentWithEditor(document: any): void {
  if (document.documentId) {
    // If the document already exists, navigate to the editor page
    this.router.navigate(['/edit-document', document.documentId]);
  } else {
    // If it's a new document, create it first
    const newDocument = {
      title: 'New Document',
      type: 'TXT', // Default type for editor-based documents
      status: 'DRAFT',
      tags: [],
      description: 'Document created with TinyMCE editor',
      file: null, // No file path
      content: '' // Initialize with empty content
    };

    this.documentService.createDocument(newDocument).subscribe(response => {
      console.log('Document created:', response);
      this.router.navigate(['/edit-document', response.documentId]); // Redirect to editor page
    });
  }
}
}
