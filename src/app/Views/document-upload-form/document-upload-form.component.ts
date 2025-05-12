import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DocumentService } from '../service/Documentation/document.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-document-upload-form',
    templateUrl: './document-upload-form.component.html',
    styleUrls: ['./document-upload-form.component.css']
})
export class DocumentUploadFormComponent implements OnInit {
    @Input() folderId: number | undefined;
    @Input() editingDocument: any | null = null;
    @Output() uploadComplete = new EventEmitter<void>();
    @Output() cancel = new EventEmitter<void>();
    uploadForm!: FormGroup;
    isEditMode: boolean = false;

    constructor(private documentService: DocumentService, private fb: FormBuilder) { }

    ngOnInit(): void {
        this.isEditMode = !!this.editingDocument; // Set edit mode based on editingDocument

        this.uploadForm = this.fb.group({
            title: [this.editingDocument ? this.editingDocument.title : '', Validators.required],
            type: [this.editingDocument ? this.editingDocument.type : 'PDF', Validators.required],
            status: [this.editingDocument ? this.editingDocument.status : 'DRAFT', Validators.required],
            tags: [this.editingDocument ? this.editingDocument.tags : '', Validators.required],
            description: [this.editingDocument ? this.editingDocument.description : '', Validators.required],
            file: [null, this.isEditMode ? null : Validators.required] // File is required for add, optional for edit
        });

        if (this.editingDocument) {
            console.log("Editing document in upload form:", this.editingDocument);
        }
    }

    onFileChange(event: any): void {
        this.uploadForm.get('file')?.setValue(event.target.files[0]);
    }

    onSubmit(): void {
        if (this.uploadForm.valid && this.folderId) {
            const formData = new FormData();
            if (this.uploadForm.get('file')?.value) {
                formData.append('file', this.uploadForm.get('file')?.value);
            }
            formData.append('title', this.uploadForm.value.title);
            formData.append('type', this.uploadForm.value.type);
            formData.append('status', this.uploadForm.value.status);
            formData.append('tags', this.uploadForm.value.tags);
            formData.append('description', this.uploadForm.value.description);
            formData.append('folderId', String(this.folderId));

            console.log('FormData:', formData);

            if (this.isEditMode) {
                console.log("Calling updateDocument with documentId:", this.editingDocument.documentId);
                this.documentService.updateDocument(this.editingDocument.documentId, formData).subscribe({
                    next: () => this.uploadComplete.emit(),
                    error: (error) => {
                        console.error('Update error:', error);
                        console.log('Detailed error:', error);
                    },
                    complete: () => console.log('Update complete')
                });
            } else {
                this.documentService.uploadDocument(formData).subscribe({
                    next: () => this.uploadComplete.emit(),
                    error: (error) => {
                        console.error('Upload error:', error);
                        console.log('Detailed error:', error);
                    },
                    complete: () => console.log('Upload complete')
                });
            }
        }
    }

    onCancel(): void {
        this.cancel.emit();
    }

    getFileName(filePath: string): string {
        if (!filePath) {
            return '';
        }
        const parts = filePath.split('/');
        return parts[parts.length - 1];
    }
}
